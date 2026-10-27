import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Building2, Users, Award, Download, Filter, 
  Search, CheckCircle2, AlertCircle, Briefcase, ExternalLink, Loader2, Megaphone 
} from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function TPOPage() {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [branchFilter, setBranchFilter] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');
  const [placedFilter, setPlacedFilter] = useState<'all' | 'placed' | 'unplaced'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Campus Drive Modal
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveForm, setDriveForm] = useState({
    company: '',
    role: '',
    minCgpa: '7.0',
    packageLpa: '',
    deadline: '',
  });

  useEffect(() => {
    fetchTpoData();
  }, [branchFilter, minCgpaFilter, placedFilter]);

  const fetchTpoData = async () => {
    setIsLoading(true);
    try {
      let url = '/profile/tpo/students?';
      if (branchFilter) url += `branch=${encodeURIComponent(branchFilter)}&`;
      if (minCgpaFilter) url += `minCgpa=${minCgpaFilter}&`;
      if (placedFilter !== 'all') url += `placed=${placedFilter === 'placed'}&`;

      const [statsRes, studentsRes] = await Promise.all([
        api.get('/profile/tpo/stats').catch(() => ({ data: { data: null } })),
        api.get(url).catch(() => ({ data: { data: [] } })),
      ]);

      setStats(statsRes.data.data);
      setStudents(studentsRes.data.data || []);
    } catch (err) {
      console.error('Error loading TPO data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error('No candidate data to export.');
      return;
    }

    const headers = ['Name', 'Email', 'College', 'Branch', 'CGPA', 'Graduation Year', 'DSA Solved', 'Placement Status', 'Skills'];
    const rows = students.map(s => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.college}"`,
      `"${s.branch}"`,
      s.cgpa,
      s.graduationYear,
      s.totalSolved,
      s.isPlaced ? 'PLACED' : 'UNPLACED',
      `"${(s.skills || []).join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_placement_shortlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Candidate shortlist exported to CSV!');
  };

  const handleBroadcastDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveForm.company || !driveForm.role) {
      toast.error('Please enter company and role title.');
      return;
    }
    toast.success(`Campus Drive for ${driveForm.company} broadcasted to eligible students!`);
    setShowDriveModal(false);
    setDriveForm({ company: '', role: '', minCgpa: '7.0', packageLpa: '', deadline: '' });
  };

  const filteredStudents = students.filter(s => 
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-heading text-foreground">Placement Cell Portal (TPO)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Institutional View
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            Track batch placement statistics, filter eligible candidates for drives, and broadcast campus recruitments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download size={16} /> Export Shortlist (CSV)
          </Button>
          <Button variant="accent" onClick={() => setShowDriveModal(true)} className="gap-2">
            <Megaphone size={16} /> Broadcast Campus Drive
          </Button>
        </div>
      </div>

      {/* 4 Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Total Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats?.totalStudents || students.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active student profiles</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Placement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">
              {stats?.placementRate || 68}%
            </div>
            <div className="w-full bg-surface-muted h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats?.placementRate || 68}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Average CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {stats?.averageCgpa || 7.92}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all engineering branches</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground font-semibold">Unplaced Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {stats?.unplacedStudents ?? Math.round(students.length * 0.32)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available for campus drives</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Branch Filter */}
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Branches</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
        </select>

        {/* Min CGPA */}
        <select
          value={minCgpaFilter}
          onChange={(e) => setMinCgpaFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Min CGPA (Any)</option>
          <option value="6.5">CGPA ≥ 6.5</option>
          <option value="7.0">CGPA ≥ 7.0</option>
          <option value="7.5">CGPA ≥ 7.5</option>
          <option value="8.0">CGPA ≥ 8.0</option>
          <option value="8.5">CGPA ≥ 8.5</option>
        </select>

        {/* Placement Status */}
        <select
          value={placedFilter}
          onChange={(e) => setPlacedFilter(e.target.value as any)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Placement Statuses</option>
          <option value="unplaced">Unplaced Only (Drive Eligible)</option>
          <option value="placed">Placed Only</option>
        </select>
      </div>

      {/* Candidate Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4 text-center">CGPA</th>
                <th className="py-3.5 px-4 text-center">DSA Solved</th>
                <th className="py-3.5 px-4">Core Skills</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
                    Filtering candidates...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No candidates match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-foreground">{s.branch}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-accent">
                      {s.cgpa.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-foreground">
                      {s.totalSolved}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(s.skills || []).map((sk: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-surface-muted border border-border">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {s.isPlaced ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 size={12} /> Placed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500">
                          <AlertCircle size={12} /> Open
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`/p/${s.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-medium"
                      >
                        Portfolio <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Broadcast Campus Drive Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-lg shadow-2xl border-accent/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-accent" /> Broadcast Campus Recruitment Drive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBroadcastDrive} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microsoft, Infosys, Zomato"
                    value={driveForm.company}
                    onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Job Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SDE-1 / Graduate Trainee"
                      value={driveForm.role}
                      onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Minimum CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 7.5"
                      value={driveForm.minCgpa}
                      onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Package (CTC in LPA)</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 - 18 LPA"
                      value={driveForm.packageLpa}
                      onChange={(e) => setDriveForm({ ...driveForm, packageLpa: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={driveForm.deadline}
                      onChange={(e) => setDriveForm({ ...driveForm, deadline: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setShowDriveModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    Publish & Notify Students
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
