import { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Calendar,
  Activity,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

export default function TrafficGrowthChart() {
  const [timeRange, setTimeRange] = useState(30); // 7, 14, 30
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [activeSeries, setActiveSeries] = useState({ pageViews: true, visitors: true });

  const svgRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTraffic = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/analytics/summary?days=${timeRange}`);
        if (isMounted && res.data?.success) {
          setData(res.data.timeline || []);
          setSummary(res.data.summary || null);
        }
      } catch (err) {
        console.error('Failed to load traffic analytics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTraffic();
    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  // Chart dimensions & scaling
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute maximum values for scaling
  const maxVal = useMemo(() => {
    if (!data.length) return 100;
    const max = Math.max(...data.map((d) => Math.max(d.pageViews || 0, d.visitors || 0)));
    // Round up to nearest 50 for clean scale
    return Math.max(50, Math.ceil(max / 50) * 50);
  }, [data]);

  // Coordinate mapping
  const points = useMemo(() => {
    if (!data.length) return { views: [], visitors: [] };
    const step = chartWidth / (data.length - 1 || 1);

    const views = data.map((d, i) => ({
      x: padding.left + i * step,
      y: padding.top + chartHeight - ((d.pageViews || 0) / maxVal) * chartHeight,
      val: d.pageViews || 0,
      name: d.name,
      date: d.date,
    }));

    const visitors = data.map((d, i) => ({
      x: padding.left + i * step,
      y: padding.top + chartHeight - ((d.visitors || 0) / maxVal) * chartHeight,
      val: d.visitors || 0,
      name: d.name,
      date: d.date,
    }));

    return { views, visitors };
  }, [data, chartWidth, chartHeight, padding, maxVal]);

  // Generate smooth cubic Bézier curve path
  const generateCurvedPath = (pts) => {
    if (!pts.length) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  // Generate closed area path for gradient fill
  const generateAreaPath = (pts) => {
    if (!pts.length) return '';
    const linePath = generateCurvedPath(pts);
    const bottomY = padding.top + chartHeight;
    const lastX = pts[pts.length - 1].x;
    const firstX = pts[0].x;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const viewsLinePath = useMemo(() => generateCurvedPath(points.views), [points.views]);
  const viewsAreaPath = useMemo(() => generateAreaPath(points.views), [points.views]);

  const visitorsLinePath = useMemo(() => generateCurvedPath(points.visitors), [points.visitors]);
  const visitorsAreaPath = useMemo(() => generateAreaPath(points.visitors), [points.visitors]);

  // Handle mouse hover across SVG
  const handleMouseMove = (e) => {
    if (!svgRef.current || !data.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = width / rect.width;
    const mouseX = clientX * scaleX;

    const step = chartWidth / (data.length - 1 || 1);
    const rawIdx = Math.round((mouseX - padding.left) / step);
    const clampedIdx = Math.max(0, Math.min(data.length - 1, rawIdx));
    setHoverIndex(clampedIdx);
  };

  // Handle touch drag across SVG on mobile devices
  const handleTouchMove = (e) => {
    if (!svgRef.current || !data.length || !e.touches || !e.touches[0]) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches[0].clientX - rect.left;
    const scaleX = width / rect.width;
    const mouseX = clientX * scaleX;

    const step = chartWidth / (data.length - 1 || 1);
    const rawIdx = Math.round((mouseX - padding.left) / step);
    const clampedIdx = Math.max(0, Math.min(data.length - 1, rawIdx));
    setHoverIndex(clampedIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Active hover item data
  const hoveredItem = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;
  const hoveredViewPoint = hoverIndex !== null && points.views[hoverIndex] ? points.views[hoverIndex] : null;
  const hoveredVisitorPoint = hoverIndex !== null && points.visitors[hoverIndex] ? points.visitors[hoverIndex] : null;

  // Growth rates
  const viewsGrowth = summary?.pageViewsGrowth ?? 0;
  const isPositiveGrowth = viewsGrowth >= 0;

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm overflow-hidden">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-gray-50">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-text">
              Website Traffic Growth
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ring-1 transition-colors ${
                isPositiveGrowth
                  ? 'bg-[#10b981]/10 text-[#059669] ring-[#10b981]/20'
                  : 'bg-red-50 text-red-600 ring-red-500/20'
              }`}
            >
              {isPositiveGrowth ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {isPositiveGrowth ? `+${viewsGrowth}%` : `${viewsGrowth}%`} vs last period
            </span>
          </div>
          <p className="font-body text-xs sm:text-sm text-text-muted mt-1">
            Real-time showroom visitor analytics and website engagement trends.
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto bg-background p-1 rounded-xl border border-gray-100 overflow-x-auto justify-between sm:justify-start">
          {[
            { label: '7 Days', days: 7 },
            { label: '14 Days', days: 14 },
            { label: '30 Days', days: 30 },
          ].map((range) => (
            <button
              key={range.days}
              onClick={() => setTimeRange(range.days)}
              className={`flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 rounded-lg font-body text-xs font-semibold transition-all text-center min-h-[36px] flex items-center justify-center ${
                timeRange === range.days
                  ? 'bg-surface text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 my-4 sm:my-5">
        {/* Total Page Views */}
        <div className="bg-background/60 rounded-xl p-3 sm:p-4 border border-gray-100/80">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-text-muted font-medium truncate">Total Page Views</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading font-bold text-lg sm:text-2xl text-text mt-2">
            {loading ? '—' : (summary?.totalPageViews || 0).toLocaleString('en-IN')}
          </p>
          <p className="font-body text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">+{summary?.pageViewsGrowth || 0}%</span>
            <span className="truncate">growth rate</span>
          </p>
        </div>

        {/* Unique Visitors */}
        <div className="bg-background/60 rounded-xl p-3 sm:p-4 border border-gray-100/80">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-text-muted font-medium truncate">Unique Visitors</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading font-bold text-lg sm:text-2xl text-text mt-2">
            {loading ? '—' : (summary?.totalVisitors || 0).toLocaleString('en-IN')}
          </p>
          <p className="font-body text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
            <span className="text-blue-600 font-semibold">+{summary?.visitorsGrowth || 0}%</span>
            <span className="truncate">audience growth</span>
          </p>
        </div>

        {/* Daily Average */}
        <div className="bg-background/60 rounded-xl p-3 sm:p-4 border border-gray-100/80">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-text-muted font-medium truncate">Daily Average</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading font-bold text-lg sm:text-2xl text-text mt-2">
            {loading ? '—' : (summary?.dailyAverage || 0).toLocaleString('en-IN')}
          </p>
          <p className="font-body text-[11px] text-text-muted mt-0.5">Views per day</p>
        </div>

        {/* Peak Traffic */}
        <div className="bg-background/60 rounded-xl p-3 sm:p-4 border border-gray-100/80">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-text-muted font-medium truncate">Peak Traffic Day</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading font-bold text-lg sm:text-2xl text-text mt-2">
            {loading ? '—' : `${summary?.peakViews || 0} views`}
          </p>
          <p className="font-body text-[11px] text-text-muted mt-0.5 truncate">
            {summary?.peakDate ? `Highest on ${summary.peakDate}` : 'Peak recorded'}
          </p>
        </div>
      </div>

      {/* ── Series Toggles & Legend ── */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 mb-2 pt-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveSeries((s) => ({ ...s, pageViews: !s.pageViews }))}
            className={`min-h-[36px] flex items-center gap-2 text-xs font-semibold transition-opacity active:scale-95 ${
              activeSeries.pageViews ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-[#10b981] shadow-sm shadow-[#10b981]/50" />
            <span className="text-text">Page Views</span>
          </button>
          <button
            onClick={() => setActiveSeries((s) => ({ ...s, visitors: !s.visitors }))}
            className={`min-h-[36px] flex items-center gap-2 text-xs font-semibold transition-opacity active:scale-95 ${
              activeSeries.visitors ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-sm shadow-[#3b82f6]/50" />
            <span className="text-text">Unique Visitors</span>
          </button>
        </div>

        {hoveredItem && (
          <div className="text-[11px] sm:text-xs font-medium text-text-muted flex items-center gap-2 sm:gap-3 animate-[fadeScale_150ms_ease-out] w-full sm:w-auto justify-between sm:justify-start bg-background/50 px-2.5 py-1 rounded-lg border border-gray-100/50">
            <span className="font-semibold text-text">{hoveredItem.name}</span>
            <span className="text-[#059669] font-bold">{hoveredItem.pageViews} views</span>
            <span className="text-[#2563eb] font-bold">{hoveredItem.visitors} visitors</span>
          </div>
        )}
      </div>

      {/* ── Interactive SVG Area Chart ── */}
      <div className="relative w-full overflow-hidden select-none touch-pan-y">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}
        >
          <defs>
            {/* Emerald Gradient for Page Views */}
            <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Blue Gradient for Visitors */}
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartHeight * (1 - ratio);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-100"
                  strokeDasharray={ratio === 0 ? '0' : '4 4'}
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-text-muted/60 font-body"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Render Area & Line for Unique Visitors */}
          {activeSeries.visitors && visitorsAreaPath && (
            <path d={visitorsAreaPath} fill="url(#visitorsGradient)" />
          )}
          {activeSeries.visitors && visitorsLinePath && (
            <path
              d={visitorsLinePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Render Area & Line for Page Views */}
          {activeSeries.pageViews && viewsAreaPath && (
            <path d={viewsAreaPath} fill="url(#pageViewsGradient)" />
          )}
          {activeSeries.pageViews && viewsLinePath && (
            <path
              d={viewsLinePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X-Axis Date Labels (Selective rendering based on count) */}
          {data.map((d, i) => {
            const step = (width - padding.left - padding.right) / (data.length - 1 || 1);
            const x = padding.left + i * step;

            // Show ~6-8 labels evenly
            const interval = Math.ceil(data.length / 7);
            const isVisible = i === 0 || i === data.length - 1 || i % interval === 0;
            if (!isVisible) return null;

            return (
              <text
                key={i}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] fill-text-muted/60 font-body"
              >
                {d.name}
              </text>
            );
          })}

          {/* Hover Crosshair & Data Indicator Dots */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical Guide Line */}
              <line
                x1={points.views[hoverIndex]?.x || 0}
                y1={padding.top}
                x2={points.views[hoverIndex]?.x || 0}
                y2={padding.top + chartHeight}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />

              {/* Unique Visitors Hover Dot */}
              {activeSeries.visitors && hoveredVisitorPoint && (
                <g>
                  <circle
                    cx={hoveredVisitorPoint.x}
                    cy={hoveredVisitorPoint.y}
                    r="6"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="drop-shadow-md"
                  />
                  <circle
                    cx={hoveredVisitorPoint.x}
                    cy={hoveredVisitorPoint.y}
                    r="10"
                    fill="#3b82f6"
                    opacity="0.2"
                  />
                </g>
              )}

              {/* Page Views Hover Dot */}
              {activeSeries.pageViews && hoveredViewPoint && (
                <g>
                  <circle
                    cx={hoveredViewPoint.x}
                    cy={hoveredViewPoint.y}
                    r="6"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="drop-shadow-md"
                  />
                  <circle
                    cx={hoveredViewPoint.x}
                    cy={hoveredViewPoint.y}
                    r="10"
                    fill="#10b981"
                    opacity="0.2"
                  />
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-surface/70 backdrop-blur-xs flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-body text-text-muted">
              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span>Updating traffic metrics...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
