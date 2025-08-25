import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Crown, Globe, Timer, AlertTriangle, Truck, Package, ShieldCheck, Factory, RefreshCw, Search, TrendingUp } from "lucide-react";

// shadcn/ui components
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * SUPPLY PARTNERS OVERVIEW
 * Single page that fetches two APIs and presents a clean, at-a-glance view of:
 *  - Tyre suppliers
 *  - Body suppliers
 *
 * Focus: minimal clutter, strong highlight of the Primary supplier (priority = 1),
 * quick health signals (lead time, reliability/defect rate, geo risk, delays, price index),
 * and an easy table to scan others.
 *
 * Theme: white/blue, soft shadows, rounded cards.
 */

const API_TYRES = "http://localhost:3000/api/suppliers"; // tyres
const API_BODY = "http://localhost:3000/api/bodyUnit";   // body frames

export default function SupplyPartnersOverview() {
  const [tyreSuppliers, setTyreSuppliers] = useState([]);
  const [bodySuppliers, setBodySuppliers] = useState([]);
  const [loading, setLoading] = useState({ tyres: true, body: true });
  const [error, setError] = useState({ tyres: "", body: "" });

  const [tyreQuery, setTyreQuery] = useState("");
  const [bodyQuery, setBodyQuery] = useState("");


const getTyres = async () => {
  try {
    const response = await axios.get(API_TYRES);
    const normalized = response.data.map(s => ({
      ...s,
      name: s.name || s.company_name || s.supplier || "-",  // fallback fix
    }));
    setTyreSuppliers(normalized);
    setError(prev => ({ ...prev, tyres: "" }));
  } catch (error) {
    console.error("Error fetching tyre suppliers:", error);
    setError(prev => ({ ...prev, tyres: "Couldn't load tyre suppliers." }));
  } finally {
    setLoading(prev => ({ ...prev, tyres: false })); // ✅ ensure stop loading
  }
};

const getBody = async () => {
  try {
    const response = await axios.get(API_BODY);
    const normalized = response.data.map(s => ({
      ...s,
      name: s.name || s.company_name || s.supplier || "-",  // fallback fix
    }));
    setBodySuppliers(normalized);
    setError(prev => ({ ...prev, body: "" }));
  } catch (error) {
    console.error("Error fetching body suppliers:", error);
    setError(prev => ({ ...prev, body: "Couldn't load body suppliers." }));
  } finally {
    setLoading(prev => ({ ...prev, body: false })); // ✅ ensure stop loading
  }
};


  useEffect(() => {
    getTyres();
    getBody();
  }, []);


  const tyrePrimary = useMemo(() => pickPrimary(tyreSuppliers), [tyreSuppliers]);
  const bodyPrimary = useMemo(() => pickPrimary(bodySuppliers), [bodySuppliers]);

  const filteredTyres = useMemo(() =>
    filterByQuery(sortByPriority(tyreSuppliers), tyreQuery),
    [tyreSuppliers, tyreQuery]
  );
  const filteredBody = useMemo(() =>
    filterByQuery(sortByPriority(bodySuppliers), bodyQuery),
    [bodySuppliers, bodyQuery]
  );

//   const reload = () => {
//     setLoading({ tyres: true, body: true });
//     setError({ tyres: "", body: "" });
//     // Re-run the same effects by calling APIs again
//     (async () => {
//       try {
//         const [tRes, bRes] = await Promise.all([
//           axios.get(API_TYRES),
//           axios.get(API_BODY),
//         ]);
//         setTyreSuppliers(Array.isArray(tRes.data) ? tRes.data : []);
//         setBodySuppliers(Array.isArray(bRes.data) ? bRes.data : []);
//       } catch (e) {
//         console.error(e);
//         setError({ tyres: "Couldn't load tyre suppliers.", body: "Couldn't load body suppliers." });
//       } finally {
//         setLoading({ tyres: false, body: false });
//       }
//     })();
//   };

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 text-slate-900">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Supply Partners Overview</h1>
            <p className="text-sm text-slate-500">Tyres & EV Body suppliers — primary partner highlights and quick health signals.</p>
          </div>
          {/* <div className="flex gap-2">
            <Button variant="outline" onClick={reload} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div> */}
        </div>

        {/* Primary highlight cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <PrimaryCard
              title="Tyres"
              icon={<Package className="h-5 w-5" />}
              loading={loading.tyres}
              error={error.tyres}
              primary={tyrePrimary}
              fields={buildTyreFieldConfig(tyrePrimary)}
              emptyHint="Add tyre suppliers to see a primary partner here."
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <PrimaryCard
              title="EV Body"
              icon={<Factory className="h-5 w-5" />}
              loading={loading.body}
              error={error.body}
              primary={bodyPrimary}
              fields={buildBodyFieldConfig(bodyPrimary)}
              emptyHint="Add body suppliers to see a primary partner here."
            />
          </motion.div>
        </div>

        <Separator className="my-8" />

        {/* Detail tabs */}
        <Tabs defaultValue="tyres" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tyres" className="gap-2">
              <Package className="h-4 w-4" /> Tyres
            </TabsTrigger>
            <TabsTrigger value="body" className="gap-2">
              <Factory className="h-4 w-4" /> EV Body
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tyres" className="mt-6">
            <SectionHeader
              title="Tyre Suppliers"
              subtitle="Sorted by priority — lower number means higher preference."
              query={tyreQuery}
              onQuery={setTyreQuery}
            />
            <SupplierTable
              type="tyre"
              loading={loading.tyres}
              error={error.tyres}
              suppliers={filteredTyres}
            />
          </TabsContent>

          <TabsContent value="body" className="mt-6">
            <SectionHeader
              title="EV Body Suppliers"
              subtitle="Sorted by priority — lower number means higher preference."
              query={bodyQuery}
              onQuery={setBodyQuery}
            />
            <SupplierTable
              type="body"
              loading={loading.body}
              error={error.body}
              suppliers={filteredBody}
            />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

/** UTILITIES **/
function pickPrimary(list = []) {
  if (!list?.length) return null;
  const sorted = [...list].sort((a, b) => (a?.priority ?? 999) - (b?.priority ?? 999));
  return sorted[0] || null;
}

function sortByPriority(list = []) {
  return [...list].sort((a, b) => (a?.priority ?? 999) - (b?.priority ?? 999));
}

function filterByQuery(list = [], q = "") {
  if (!q) return list;
  const query = q.toLowerCase();
  return list.filter((s) =>
    [s?.name, s?.country, s?.product].some((val) => String(val || "").toLowerCase().includes(query))
  );
}

function pct(n) {
  if (n == null || isNaN(n)) return "-";
  return `${(Number(n) * 100).toFixed(0)}%`;
}

function days(n) {
  if (n == null || isNaN(n)) return "-";
  return `${n} d`;
}

function riskLevel(v) {
  if (v == null || isNaN(v)) return { label: "Unknown", className: "bg-slate-200 text-slate-700" };
  if (v < 0.33) return { label: "Low", className: "bg-emerald-100 text-emerald-700" };
  if (v < 0.66) return { label: "Medium", className: "bg-amber-100 text-amber-700" };
  return { label: "High", className: "bg-rose-100 text-rose-700" };
}

function priceIndexText(v) {
  if (v == null || isNaN(v)) return "-";
  // For tyres dataset, 100 seems to be baseline. For body price_index looks like 1 (ratio).
  // We'll show raw value and a tiny hint.
  return String(v);
}

/** FIELD CONFIG BUILDERS **/
function buildTyreFieldConfig(s) {
  if (!s) return [];
  return [
    { icon: <Timer className="h-4 w-4" />, label: "Avg Lead Time", value: days(s.avg_lead_time) },
    { icon: <ShieldCheck className="h-4 w-4" />, label: "Reliability", value: pct(s.reliability_score), progress: Number(s.reliability_score) * 100 },
    { icon: <AlertTriangle className="h-4 w-4" />, label: "Geo Risk", value: riskLevel(s.geopolitical_risk).label, chip: riskLevel(s.geopolitical_risk).className },
    { icon: <Truck className="h-4 w-4" />, label: "Delay", value: days(s.delay_days) },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Price Index", value: priceIndexText(s.price_index) },
  ];
}

function transportStatusText(v) {
  const map = {
    0: "At origin",
    1: "In transit",
    2: "At port",
    3: "Customs",
    4: "Delivered",
  };
  return map?.[v] ?? "—";
}

function buildBodyFieldConfig(s) {
  if (!s) return [];
  return [
    { icon: <Timer className="h-4 w-4" />, label: "Delay", value: days(s.delay_days) },
    { icon: <Package className="h-4 w-4" />, label: "Expected Units", value: s.expected_units ?? "-" },
    { icon: <AlertTriangle className="h-4 w-4" />, label: "Defect Rate", value: pct(s.defective_rate), progress: Number(s.defective_rate) * 100, inverse: true },
    { icon: <AlertTriangle className="h-4 w-4" />, label: "Geo Risk", value: riskLevel(s.geopolitical_risk).label, chip: riskLevel(s.geopolitical_risk).className },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Price Index", value: priceIndexText(s.price_index) },
    { icon: <Truck className="h-4 w-4" />, label: "Transport", value: transportStatusText(s.transport_status) },
  ];
}

/** COMPONENTS **/
function PrimaryCard({ title, icon, loading, error, primary, fields, emptyHint }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">{icon}</div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700">
          <Crown className="h-3.5 w-3.5" /> Primary
        </Badge>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-sm text-rose-600">{error}</div>
        ) : !primary ? (
          <div className="text-sm text-slate-500">{emptyHint}</div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{primary.name}</h3>
                  <Badge className="bg-blue-600 text-white">Priority {primary.priority ?? "-"}</Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Globe className="h-4 w-4" /> {primary.country ?? "-"} • {primary.product ?? "-"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map((f, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    {f.icon}
                    <span>{f.label}</span>
                  </div>
                  <div className="mt-1.5 text-base font-medium">
                    {f.chip ? (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${f.chip}`}>{f.value}</span>
                    ) : (
                      f.value
                    )}
                  </div>
                  {typeof f.progress === "number" && !isNaN(f.progress) && (
                    <div className="mt-2">
                      <Progress value={Math.max(0, Math.min(100, f.inverse ? 100 - f.progress : f.progress))} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500">Primary supplier is determined by the lowest <span className="font-medium">priority</span> number.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, subtitle, query, onQuery }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, country, product"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>
    </div>
  );
}

function SupplierTable({ type, loading, error, suppliers }) {
  const isTyre = type === "tyre";

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-rose-600">{error}</div>;
  }

  if (!suppliers?.length) {
    return <div className="text-sm text-slate-500">No suppliers found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60">
            <TableHead>Company</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Priority</TableHead>
            {isTyre ? (
              <>
                <TableHead>Avg Lead</TableHead>
                <TableHead>Reliability</TableHead>
              </>
            ) : (
              <>
                <TableHead>Expected Units</TableHead>
                <TableHead>Defect Rate</TableHead>
              </>
            )}
            <TableHead>Geo Risk</TableHead>
            <TableHead>Delay</TableHead>
            <TableHead>Price Index</TableHead>
            {!isTyre && <TableHead>Transport</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((s) => (
            <TableRow key={s._id} className="">
              <TableCell className="font-medium flex items-center gap-2">
                {s.priority === 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-blue-600 text-white"><Crown className="h-3.5 w-3.5 mr-1" /> Primary</Badge>
                    </TooltipTrigger>
                    <TooltipContent>Lowest priority value</TooltipContent>
                  </Tooltip>
                )}
                {s.name ?? "-"}
              </TableCell>
              <TableCell className="text-slate-600">{s.country ?? "-"}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{s.priority ?? "-"}</span>
              </TableCell>

              {isTyre ? (
                <>
                  <TableCell>{days(s.avg_lead_time)}</TableCell>
                  <TableCell className="min-w-[160px]">
                    {typeof s.reliability_score === "number" ? (
                      <div className="flex items-center gap-2">
                        <Progress value={Math.max(0, Math.min(100, s.reliability_score * 100))} className="w-40" />
                        <span className="text-xs text-slate-600">{pct(s.reliability_score)}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{s.expected_units ?? "-"}</TableCell>
                  <TableCell className="min-w-[160px]">
                    {typeof s.defective_rate === "number" ? (
                      <div className="flex items-center gap-2">
                        <Progress value={Math.max(0, Math.min(100, 100 - s.defective_rate * 100))} className="w-40" />
                        <span className="text-xs text-slate-600">{pct(s.defective_rate)}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </>
              )}

              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${riskLevel(s.geopolitical_risk).className}`}>
                  {riskLevel(s.geopolitical_risk).label}
                </span>
              </TableCell>
              <TableCell>{days(s.delay_days)}</TableCell>
              <TableCell>{priceIndexText(s.price_index)}</TableCell>
              {!isTyre && (
                <TableCell>
                  <span className="text-slate-700 text-sm">{transportStatusText(s.transport_status)}</span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
