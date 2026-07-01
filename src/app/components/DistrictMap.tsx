'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L, { GeoJSONOptions, Layer, PathOptions } from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { District } from '@/types';
import { resolveDistrictName } from '@/lib/utils';

// Fix Leaflet default icon paths (SSR safe)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface DistrictMapProps {
  districts: District[];
  loading: boolean;
  onDistrictSelect: (district: District) => void;
  selectedDistrictId: number | null;
}

export default function DistrictMap({
  districts,
  loading,
  onDistrictSelect,
  selectedDistrictId,
}: DistrictMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // ── Fetch GeoJSON once ────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/geojson/tamil-nadu-districts.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<FeatureCollection>;
      })
      .then(setGeoData)
      .catch((e) => setGeoError(String(e)));
  }, []);

  // ── Re-style GeoJSON layer when selection changes ─────────────────────────
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;
    geoJsonLayerRef.current.eachLayer((layer: Layer) => {
      const gLayer = layer as L.Path & { feature?: Feature };
      if (!gLayer.feature) return;

      const geoName: string =
        (gLayer.feature.properties as { dtname?: string; dist?: string; district?: string })?.dtname ??
        (gLayer.feature.properties as { dist?: string })?.dist ??
        (gLayer.feature.properties as { district?: string })?.district ??
        '';
      const resolvedName = resolveDistrictName(geoName);
      const districtRow = districts.find(
        (d) => d.district_name.toLowerCase() === resolvedName.toLowerCase()
      );
      const isSelected = selectedDistrictId !== null && districtRow?.id === selectedDistrictId;

      gLayer.setStyle({
        fillColor: '#3B82F6',
        color: isSelected ? '#3B82F6' : '#94A3B8',
        fillOpacity: isSelected ? 0.35 : 0.08,
        weight: isSelected ? 2.5 : 1.0,
        opacity: isSelected ? 1 : 0.6,
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts, selectedDistrictId]);

  // ── Style function for initial render ────────────────────────────────────
  const styleFeature = (feature?: Feature<Geometry, { dtname?: string; dist?: string; district?: string }>): PathOptions => {
    if (!feature) return {};
    const geoName = feature.properties?.dtname ?? feature.properties?.dist ?? feature.properties?.district ?? '';
    const resolvedName = resolveDistrictName(geoName);
    const districtRow = districts.find(
      (d) => d.district_name.toLowerCase() === resolvedName.toLowerCase()
    );
    const isSelected = selectedDistrictId !== null && districtRow?.id === selectedDistrictId;

    return {
      fillColor: '#3B82F6',
      color: isSelected ? '#3B82F6' : '#94A3B8',
      fillOpacity: isSelected ? 0.35 : 0.08,
      weight: isSelected ? 2.5 : 1.0,
      opacity: isSelected ? 1 : 0.6,
    };
  };

  // ── Popup + Tooltip for each feature ────────────────────────────────────
  const onEachFeature: GeoJSONOptions['onEachFeature'] = (feature, layer) => {
    const geoName: string =
      (feature.properties as { dtname?: string; dist?: string })?.dtname ??
      (feature.properties as { dist?: string })?.dist ??
      '';
    const resolvedName = resolveDistrictName(geoName);

    // Find district row for LGD code
    const districtRow = districts.find(
      (d) => d.district_name.toLowerCase() === resolvedName.toLowerCase()
    );
    const lgdCode = districtRow?.lgd_code ?? (feature.properties as { lgd_code?: number })?.lgd_code ?? '—';

    // Tooltip (hover)
    layer.bindTooltip(
      `<div style="font-family:Outfit,sans-serif;padding:6px 10px;font-size:12px;color:#F8FAFC">
        <strong style="font-size:13px;display:block">${resolvedName}</strong>
        <span style="color:#94A3B8;font-size:10px;font-weight:600">LGD CODE: ${lgdCode}</span>
       </div>`,
      { sticky: true, direction: 'top', className: 'leaflet-tooltip-custom', offset: [0, -4] }
    );

    // Popup (click)
    layer.bindPopup(
      `<div style="font-family:Outfit,sans-serif;padding:12px;min-width:180px;color:#0F172A">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;border-bottom:1px solid rgba(15,23,42,0.08);padding-bottom:6px">
          <h3 style="margin:0;font-size:14px;font-weight:900;color:#0F172A">${resolvedName}</h3>
        </div>
        <table style="width:100%;font-size:11px;border-collapse:collapse">
          <tr>
            <td style="color:#64748B;padding:3px 0;font-weight:500">LGD Code</td>
            <td style="text-align:right;font-weight:700;color:#0F172A">${lgdCode}</td>
          </tr>
          <tr>
            <td style="color:#64748B;padding:3px 0;font-weight:500">State</td>
            <td style="text-align:right;font-weight:700;color:#0F172A">Tamil Nadu</td>
          </tr>
        </table>
      </div>`,
      { maxWidth: 220 }
    );

    // Hover and Click effects
    const path = layer as L.Path;
    layer.on({
      click: () => {
        if (districtRow) {
          onDistrictSelect(districtRow);
        }
      },
      mouseover: () => {
        const isSelected = selectedDistrictId !== null && districtRow?.id === selectedDistrictId;
        path.setStyle({ 
          weight: isSelected ? 3.5 : 2.5, 
          fillOpacity: isSelected ? 0.55 : 0.35 
        });
        path.bringToFront();
      },
      mouseout: () => {
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current.resetStyle(layer as L.Path);
        }
      },
    });
  };

  const geoKey = `tn-districts-${districts.length}`;

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-[#090D16]/75 backdrop-blur-md rounded-2xl border border-white/5">
          <div className="text-center space-y-3">
            <div
              className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent mx-auto"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <p className="text-sm font-semibold text-slate-300">Loading map data…</p>
          </div>
        </div>
      )}

      {geoError && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-red-950/20 border border-red-500/20 rounded-2xl">
          <p className="text-sm text-red-400 font-medium text-center px-6">
            ⚠️ Failed to load GeoJSON: {geoError}
          </p>
        </div>
      )}

      <MapContainer
        center={[10.9, 78.1]}
        zoom={7}
        style={{ width: '100%', height: '100%', borderRadius: '16px' }}
        zoomControl={false}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <ZoomControl position="topright" />

        {geoData && !loading && (
          <GeoJSON
            key={geoKey}
            data={geoData}
            style={styleFeature as GeoJSONOptions['style']}
            onEachFeature={onEachFeature}
            ref={(ref) => {
              if (ref) geoJsonLayerRef.current = ref;
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
