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

// Matching reference HTML colors exactly
const COLORS = { green: '#2ecc71', yellow: '#f1c40f', red: '#e74c3c', default: '#cbd5e1' };

function getMetricColor(metric: MetricType, value?: number): string {
  if (value == null) return COLORS.default;
  switch (metric) {
    case 'attendance':       return value >= 90 ? COLORS.green : value >= 75 ? COLORS.yellow : COLORS.red;
    case 'electricity':      return value >= 98 ? COLORS.green : value >= 90 ? COLORS.yellow : COLORS.red;
    case 'hi_tech_labs':
    case 'teachers_staffed':
    case 'wash_audited':     return value >= 90 ? COLORS.green : value >= 80 ? COLORS.yellow : COLORS.red;
    case 'total_schools':    return value >= 1000 ? COLORS.green : value >= 500 ? COLORS.yellow : COLORS.red;
    case 'neet_qualified':   return value >= 1000 ? COLORS.green : value >= 500 ? COLORS.yellow : COLORS.red;
    case 'active_blocks':    return value >= 12 ? COLORS.green : value >= 8 ? COLORS.yellow : COLORS.red;
    default: return COLORS.default;
  }
}

export default function DistrictMap({ districts, loading, onDistrictSelect, selectedDistrictId }: DistrictMapProps) {
  const { selectedMetric } = useDashboardStore();
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    fetch('/geojson/tamil-nadu-districts.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<FeatureCollection>; })
      .then(setGeoData)
      .catch(e => setGeoError(String(e)));
  }, []);

  const getDistrictFromFeature = (feature: Feature) => {
    const props = feature.properties as { dtname?: string; dist?: string; district?: string };
    const geoName = props?.dtname ?? props?.dist ?? props?.district ?? '';
    const resolvedName = resolveDistrictName(geoName);
    return { resolvedName, district: districts.find(d => d.district_name.toLowerCase() === resolvedName.toLowerCase()) };
  };

  // Re-style on metric / selection change
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;
    geoJsonLayerRef.current.eachLayer((layer: Layer) => {
      const gLayer = layer as L.Path & { feature?: Feature };
      if (!gLayer.feature) return;
      const { district } = getDistrictFromFeature(gLayer.feature);
      const isSelected = selectedDistrictId !== null && district?.id === selectedDistrictId;
      const value = district?.metrics ? Number(district.metrics[selectedMetric]) : undefined;
      gLayer.setStyle({
        fillColor: getMetricColor(selectedMetric, value),
        color: isSelected ? '#333' : '#ffffff',
        fillOpacity: 0.8,
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts, selectedDistrictId, selectedMetric]);

  const styleFeature = (feature?: Feature<Geometry>): PathOptions => {
    if (!feature) return {};
    const { district } = getDistrictFromFeature(feature);
    const isSelected = selectedDistrictId !== null && district?.id === selectedDistrictId;
    const value = district?.metrics ? Number(district.metrics[selectedMetric]) : undefined;
    return {
      fillColor: getMetricColor(selectedMetric, value),
      color: isSelected ? '#333' : '#ffffff',
      fillOpacity: 0.8,
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
    };
  };

  const onEachFeature: GeoJSONOptions['onEachFeature'] = (feature, layer) => {
    const { resolvedName, district } = getDistrictFromFeature(feature);
    const metricValue = district?.metrics ? district.metrics[selectedMetric] : null;
    const displayValue = metricValue != null
      ? (typeof metricValue === 'number' && ['attendance', 'hi_tech_labs', 'teachers_staffed', 'electricity', 'wash_audited'].includes(selectedMetric)
          ? `${metricValue}%`
          : new Intl.NumberFormat('en-IN').format(Number(metricValue)))
      : 'N/A';

    layer.bindTooltip(
      `<div style="font-family:Inter,sans-serif;padding:8px 12px">
        <strong style="font-size:13px;display:block;color:#2c3e50">${resolvedName}</strong>
        <div style="font-size:10px;color:#7f8c8d;text-transform:uppercase;font-weight:600;margin-top:2px">${selectedMetric.replace(/_/g,' ')}</div>
        <div style="font-size:18px;font-weight:900;color:#2c3e50;margin-top:2px">${displayValue}</div>
      </div>`,
      { sticky: true, direction: 'top', className: 'leaflet-tooltip-gov', offset: [0, -4] }
    );

    const path = layer as L.Path;
    layer.on({
      click: () => { if (district) onDistrictSelect(district); },
      mouseover: () => { path.setStyle({ weight: 3, fillOpacity: 1 }); path.bringToFront(); },
      mouseout: () => { if (geoJsonLayerRef.current) geoJsonLayerRef.current.resetStyle(layer as L.Path); },
    });
  };

  return (
    <div className="relative w-full h-full" style={{ background: '#f4f7f6' }}>
      {loading && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center" style={{ background: 'rgba(244,247,246,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-4 mx-auto mb-3" style={{ borderColor: '#3498db', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            <p className="text-sm font-semibold" style={{ color: '#7f8c8d' }}>Loading map data…</p>
          </div>
        </div>
      )}

      {geoError && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center" style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px' }}>
          <p className="text-sm font-medium text-center px-6" style={{ color: '#dc2626' }}>⚠️ Failed to load GeoJSON: {geoError}</p>
        </div>
      )}

      <MapContainer
        center={[11.1271, 78.6569]}
        zoom={7}
        style={{ width: '100%', height: '100%' }}
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
            key={`tn-${districts.length}-${selectedMetric}`}
            data={geoData}
            style={styleFeature as GeoJSONOptions['style']}
            onEachFeature={onEachFeature}
            ref={ref => { if (ref) geoJsonLayerRef.current = ref; }}
          />
        )}
      </MapContainer>

      {/* Map Legend — matching reference HTML */}
      <div
        className="absolute bottom-5 right-5 z-[1000]"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid #e0e6ed',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '12px',
          fontWeight: 600,
          color: '#2c3e50',
        }}
      >
        {[
          { color: COLORS.green,  label: 'Good' },
          { color: COLORS.yellow, label: 'Average' },
          { color: COLORS.red,    label: 'Needs Attention' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 py-0.5">
            <div style={{ width: 14, height: 14, borderRadius: 3, background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
