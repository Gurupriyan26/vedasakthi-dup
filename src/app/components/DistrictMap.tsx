'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L, { GeoJSONOptions, Layer, PathOptions } from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { District } from '@/types';
import { resolveDistrictName } from '@/lib/utils';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';

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

// Map color configuration
const COLORS = {
  green: '#2ecc71',
  yellow: '#f1c40f',
  red: '#e74c3c',
  default: '#cccccc'
};

const getMetricColor = (metric: MetricType, value?: number) => {
  if (value === undefined || value === null) return COLORS.default;

  switch (metric) {
    case 'attendance':
      if (value >= 90) return COLORS.green;
      if (value >= 75) return COLORS.yellow;
      return COLORS.red;
    case 'electricity':
      if (value >= 98) return COLORS.green;
      if (value >= 90) return COLORS.yellow;
      return COLORS.red;
    case 'hi_tech_labs':
    case 'teachers_staffed':
    case 'wash_audited':
      if (value >= 90) return COLORS.green;
      if (value >= 80) return COLORS.yellow;
      return COLORS.red;
    case 'total_schools':
      if (value >= 1000) return COLORS.green;
      if (value >= 500) return COLORS.yellow;
      return COLORS.red;
    case 'neet_qualified':
      if (value >= 1000) return COLORS.green;
      if (value >= 500) return COLORS.yellow;
      return COLORS.red;
    case 'active_blocks':
      if (value >= 12) return COLORS.green;
      if (value >= 8) return COLORS.yellow;
      return COLORS.red;
    default:
      return COLORS.default;
  }
};

export default function DistrictMap({
  districts,
  loading,
  onDistrictSelect,
  selectedDistrictId,
}: DistrictMapProps) {
  const { selectedMetric } = useDashboardStore();
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

  // ── Re-style GeoJSON layer when selection or metric changes ────────────────
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
      const metricValue = districtRow?.metrics ? districtRow.metrics[selectedMetric] : undefined;
      const metricColor = getMetricColor(selectedMetric, typeof metricValue === 'number' ? metricValue : undefined);

      gLayer.setStyle({
        fillColor: metricColor,
        color: isSelected ? '#333' : '#ffffff',
        fillOpacity: 0.8,
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
      });
    });
  }, [districts, selectedDistrictId, selectedMetric]);

  // ── Style function for initial render ────────────────────────────────────
  const styleFeature = (feature?: Feature<Geometry, { dtname?: string; dist?: string; district?: string }>): PathOptions => {
    if (!feature) return {};
    const geoName = feature.properties?.dtname ?? feature.properties?.dist ?? feature.properties?.district ?? '';
    const resolvedName = resolveDistrictName(geoName);
    const districtRow = districts.find(
      (d) => d.district_name.toLowerCase() === resolvedName.toLowerCase()
    );
    
    const isSelected = selectedDistrictId !== null && districtRow?.id === selectedDistrictId;
    const metricValue = districtRow?.metrics ? districtRow.metrics[selectedMetric] : undefined;
    const metricColor = getMetricColor(selectedMetric, typeof metricValue === 'number' ? metricValue : undefined);

    return {
      fillColor: metricColor,
      color: isSelected ? '#333' : '#ffffff',
      fillOpacity: 0.8,
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
    };
  };

  // ── Popup + Tooltip for each feature ────────────────────────────────────
  const onEachFeature: GeoJSONOptions['onEachFeature'] = (feature, layer) => {
    const geoName: string =
      (feature.properties as { dtname?: string; dist?: string })?.dtname ??
      (feature.properties as { dist?: string })?.dist ??
      '';
    const resolvedName = resolveDistrictName(geoName);

    // Find district row
    const districtRow = districts.find(
      (d) => d.district_name.toLowerCase() === resolvedName.toLowerCase()
    );
    
    const metricValue = districtRow?.metrics ? districtRow.metrics[selectedMetric] : 'N/A';

    // Tooltip (hover)
    layer.bindTooltip(
      `<div style="font-family:Outfit,sans-serif;padding:6px 10px;font-size:12px;color:#000">
        <strong style="font-size:14px;display:block;margin-bottom:4px">${resolvedName}</strong>
        <div style="font-weight:600;color:#333;text-transform:uppercase;font-size:10px">${selectedMetric.replace('_', ' ')}</div>
        <div style="font-size:16px;font-weight:900;color:#000">${metricValue}</div>
       </div>`,
      { sticky: true, direction: 'top', className: 'leaflet-tooltip-custom-light', offset: [0, -4] }
    );

    // Click behavior
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
          weight: isSelected ? 3 : 2.5, 
          fillOpacity: 1 
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

  const geoKey = `tn-districts-${districts.length}-${selectedMetric}`;

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-white/75 backdrop-blur-sm rounded-2xl border border-slate-200">
          <div className="text-center space-y-3">
            <div
              className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent mx-auto"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <p className="text-sm font-semibold text-slate-700">Loading map data…</p>
          </div>
        </div>
      )}

      {geoError && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm text-red-600 font-medium text-center px-6">
            ⚠️ Failed to load GeoJSON: {geoError}
          </p>
        </div>
      )}

      <MapContainer
        center={[11.1271, 78.6569]}
        zoom={7}
        style={{ width: '100%', height: '100%', borderRadius: '16px' }}
        zoomControl={false}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
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
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 text-xs font-semibold text-slate-700 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.green }}></div>
          <span>Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.yellow }}></div>
          <span>Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.red }}></div>
          <span>Needs Attention</span>
        </div>
      </div>
    </div>
  );
}
