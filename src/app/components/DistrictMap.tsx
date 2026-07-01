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

// ── Classic Vibrant Palette for Dark Map ──
const PALETTE = {
  good:      '#10B981', // Emerald
  average:   '#F59E0B', // Amber
  attention: '#EF4444', // Red
  nodata:    '#1e293b', // slate-800
};

function getMetricColor(metric: MetricType, value?: number): string {
  if (value == null) return PALETTE.nodata;

  switch (metric) {
    case 'attendance':       return value >= 85 ? PALETTE.good : value >= 70 ? PALETTE.average : PALETTE.attention;
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

const PERCENT_METRICS = new Set(['attendance', 'hi_tech_labs', 'teachers_staffed', 'electricity', 'wash_audited']);

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

  const buildStyle = (district: District | undefined, isSelected: boolean): PathOptions => {
    const value = district?.metrics ? Number(district.metrics[selectedMetric]) : undefined;
    const fill = getMetricColor(selectedMetric, value);
    return {
      fillColor: fill,
      color: isSelected ? '#ffffff' : '#020617', // white border when selected, slate-950 otherwise
      fillOpacity: isSelected ? 1 : 0.85,
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
    const metricValue = district?.metrics ? district.metrics[selectedMetric] : null;
    const isPercent = PERCENT_METRICS.has(selectedMetric);
    const displayValue = metricValue != null
      ? (isPercent ? `${metricValue}%` : new Intl.NumberFormat('en-IN').format(Number(metricValue)))
      : 'No data';

    const color = district?.metrics
      ? getMetricColor(selectedMetric, Number(metricValue))
      : '#334155';

    layer.bindTooltip(
      `<div style="font-family:Inter,sans-serif;padding:12px;min-width:160px;background:#0f172a;border-radius:8px;border:1px solid #1e293b;">
        <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">${selectedMetric.replace(/_/g,' ')}</div>
        <div style="font-size:15px;font-weight:900;color:#f8fafc;margin-bottom:8px">${resolvedName}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></div>
          <span style="font-size:18px;font-weight:900;color:#f8fafc;letter-spacing:-0.03em">${displayValue}</span>
        </div>
      </div>`,
      { sticky: true, direction: 'top', className: 'leaflet-tooltip-clean-dark', offset: [0, -6] }
    );

    const path = layer as L.Path;
    layer.on({
      click: () => { if (district) onDistrictSelect(district); },
      mouseover: () => {
        path.setStyle({ weight: 2.5, fillOpacity: 1, color: '#ffffff' });
        path.bringToFront();
      },
      mouseout: () => { if (geoJsonLayerRef.current) geoJsonLayerRef.current.resetStyle(layer as L.Path); },
    });
  };

  return (
    <div className="relative w-full h-full bg-[#020617]">
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-tooltip-clean-dark { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-tooltip-clean-dark::before { display: none !important; }
      `}} />

      {loading && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full border-4 mx-auto mb-3 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-slate-400">Loading map…</p>
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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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

      {/* Highly Catchy Premium HUD Legend - Compact Version */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-[#020617]/80 backdrop-blur-xl rounded-xl p-3 border border-[#1e293b] shadow-[0_10px_40px_rgba(0,0,0,0.7)] flex flex-col min-w-[160px]">
        <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#1e293b]/80">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Telemetry Scale</span>
        </div>
        
        <div className="flex flex-col gap-1.5">
          {[
            { color: PALETTE.good,      label: 'Optimal', sub: 'Target Achieved' },
            { color: PALETTE.average,   label: 'Monitor', sub: 'Requires Review' },
            { color: PALETTE.attention, label: 'Critical', sub: 'Immediate Action' },
            { color: PALETTE.nodata,    label: 'Offline', sub: 'Awaiting Data' },
          ].map(({ color, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5 group cursor-default">
              <div 
                className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#0f172a] transition-all group-hover:scale-110"
                style={{ border: `1px solid ${color}40` }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-200 uppercase tracking-wider group-hover:text-white transition-colors">{label}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
