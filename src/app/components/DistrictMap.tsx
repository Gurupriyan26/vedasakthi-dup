'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L, { GeoJSONOptions, Layer, PathOptions } from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { District } from '@/types';
import { resolveDistrictName } from '@/lib/utils';
import { useDashboardStore, MetricType } from '@/store/useDashboardStore';

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

// ── Classic Vibrant Palette for Light Map ──
const PALETTE = {
  good:      '#10B981', // Emerald
  average:   '#F59E0B', // Amber
  attention: '#EF4444', // Red
  nodata:    '#e2e8f0', // slate-200
};

function getGeneralColor(id: number): string {
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#10b981', // emerald
    '#f59e0b', // amber
    '#14b8a6', // teal
  ];
  return colors[id % colors.length];
}

function getMetricColor(metric: MetricType, value?: number, districtId?: number): string {
  if (metric === 'general') {
    return districtId ? getGeneralColor(districtId) : '#e2e8f0';
  }

  if (value == null) return PALETTE.nodata;

  switch (metric) {
    case 'attendance':       return value >= 85 ? PALETTE.good : value >= 70 ? PALETTE.average : PALETTE.attention;
    case 'infra_status':     return value >= 85 ? PALETTE.good : value >= 70 ? PALETTE.average : PALETTE.attention;
    case 'electricity':      return value >= 95 ? PALETTE.good : value >= 85 ? PALETTE.average : PALETTE.attention;
    case 'hi_tech_labs':
    case 'teachers_staffed':
    case 'wash_audited':     return value >= 85 ? PALETTE.good : value >= 70 ? PALETTE.average : PALETTE.attention;
    case 'total_schools':    return value >= 800 ? PALETTE.good : value >= 400 ? PALETTE.average : PALETTE.attention;
    case 'neet_qualified':   return value >= 800 ? PALETTE.good : value >= 400 ? PALETTE.average : PALETTE.attention;
    case 'active_blocks':    return value >= 10 ? PALETTE.good : value >= 5 ? PALETTE.average : PALETTE.attention;
    default: return PALETTE.nodata;
  }
}

const PERCENT_METRICS = new Set(['attendance', 'hi_tech_labs', 'teachers_staffed', 'electricity', 'wash_audited', 'infra_status']);

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

  const getMetricValue = (district?: District) => {
    if (!district?.metrics) return undefined;
    if (selectedMetric === 'infra_status') {
      const grid = Number(district.metrics.electricity) || 0;
      const wash = Number(district.metrics.wash_audited) || 0;
      const labs = Number(district.metrics.hi_tech_labs) || 0;
      return (grid + wash + labs) / 3;
    }
    return Number(district.metrics[selectedMetric as keyof typeof district.metrics]);
  };

  const buildStyle = (district: District | undefined, isSelected: boolean): PathOptions => {
    const value = getMetricValue(district);
    const fill = getMetricColor(selectedMetric, value, district?.id);
    return {
      fillColor: fill,
      color: isSelected ? '#333333' : '#cbd5e1', // dark border when selected, light otherwise
      fillOpacity: isSelected ? 1 : (selectedMetric === 'general' ? 0.4 : 0.85),
      weight: isSelected ? 3 : 1,
      opacity: 1,
    };
  };

  useEffect(() => {
    if (!geoJsonLayerRef.current) return;
    geoJsonLayerRef.current.eachLayer((layer: Layer) => {
      const gLayer = layer as L.Path & { feature?: Feature };
      if (!gLayer.feature) return;
      const { district } = getDistrictFromFeature(gLayer.feature);
      const isSelected = selectedDistrictId !== null && district?.id === selectedDistrictId;
      gLayer.setStyle(buildStyle(district, isSelected));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts, selectedDistrictId, selectedMetric]);

  const styleFeature = (feature?: Feature<Geometry>): PathOptions => {
    if (!feature) return {};
    const { district } = getDistrictFromFeature(feature);
    const isSelected = selectedDistrictId !== null && district?.id === selectedDistrictId;
    return buildStyle(district, isSelected);
  };

  const onEachFeature: GeoJSONOptions['onEachFeature'] = (feature, layer) => {
    const { resolvedName, district } = getDistrictFromFeature(feature);
    const metricValue = getMetricValue(district);
    const isPercent = PERCENT_METRICS.has(selectedMetric);
    
    let displayValue = 'N/A';
    if (selectedMetric === 'general') {
      displayValue = district ? `LGD: ${district.id}` : 'N/A';
    } else if (metricValue != null) {
      displayValue = isPercent ? `${Math.round(metricValue)}%` : new Intl.NumberFormat('en-IN').format(Number(metricValue));
    }

    const color = getMetricColor(selectedMetric, metricValue, district?.id);

    layer.bindTooltip(
      `<div style="font-family:Inter,sans-serif;padding:12px;min-width:160px;background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;box-shadow:0 4px 15px rgba(0,0,0,0.05)">
        <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">${selectedMetric.replace(/_/g,' ')}</div>
        <div style="font-size:15px;font-weight:900;color:#1e293b;margin-bottom:8px">${resolvedName}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></div>
          <span style="font-size:18px;font-weight:900;color:#1e293b;letter-spacing:-0.03em">${displayValue}</span>
        </div>
      </div>`,
      { sticky: true, direction: 'top', className: 'leaflet-tooltip-clean-dark', offset: [0, -6] }
    );

    const path = layer as L.Path;
    layer.on({
      click: () => { if (district) onDistrictSelect(district); },
      mouseover: () => {
        path.setStyle({ weight: 2.5, fillOpacity: 1, color: '#333333' });
        path.bringToFront();
      },
      mouseout: () => { if (geoJsonLayerRef.current) geoJsonLayerRef.current.resetStyle(layer as L.Path); },
    });
  };

  return (
    <div className="relative w-full h-full bg-[#f4f7f6]">
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-tooltip-clean-dark { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-tooltip-clean-dark::before { display: none !important; }
      `}} />

      {loading && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full border-4 mx-auto mb-3 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Loading map…</p>
          </div>
        </div>
      )}

      {geoError && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-red-950/80 backdrop-blur-sm">
          <p className="text-sm font-medium text-center px-6 text-red-500">⚠️ {geoError}</p>
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
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
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

      {/* Host Required Performance Legend */}
      {selectedMetric !== 'general' && (
        <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-xl rounded-xl p-4 border border-slate-200 shadow-md flex flex-col gap-2.5">
          {[
            { color: PALETTE.good,      label: 'High Performance' },
            { color: PALETTE.average,   label: 'Average' },
            { color: PALETTE.attention, label: 'Needs Attention' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-3 group cursor-default">
              <div 
                className="w-3.5 h-3.5 rounded-[3px]"
                style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
              />
              <span className="text-[12px] font-bold text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
