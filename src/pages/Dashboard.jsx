import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, LogOut } from "lucide-react";
import DocumentCard from "@/components/documents/DocumentCard";
import RenameDialog from "@/components/documents/RenameDialog";
import DeleteConfirmDialog from "@/components/documents/DeleteConfirmDialog";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [renameDoc, setRenameDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => base44.entities.Document.list("-last_modified", 100),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      base44.entities.Document.create({
        title: "Untitled Document",
        content: "",
        owner_email: currentUser?.email,
        owner_name: currentUser?.full_name || currentUser?.email,
        shared_with: [],
        last_modified: new Date().toISOString(),
      }),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      navigate(`/editor/${doc.id}`);
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }) =>
      base44.entities.Document.update(id, { title, last_modified: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document renamed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted");
    },
  });

  const visibleDocs = docs
    .filter((d) => {
      const isOwner = d.owner_email === currentUser?.email;
      const isShared = d.shared_with?.includes(currentUser?.email);
      if (tab === "owned") return isOwner;
      if (tab === "shared") return isShared;
      return isOwner || isShared;
    })
    .filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-playfair font-semibold text-lg text-foreground">DocFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="text-sm text-muted-foreground hidden sm:inline truncate max-w-[200px]">
                {currentUser.full_name || currentUser.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => base44.auth.logout()}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title + new doc */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-semibold text-foreground">My Documents</h1>
            <p className="text-sm text-muted-foreground mt-1">{docs.length} document{docs.length !== 1 ? "s" : ""}</p>
          </div>
          <Button
            onClick={() => currentUser && createMutation.mutate()}
            disabled={!currentUser || createMutation.isPending}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> New Document
          </Button>
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="owned">Owned</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Document grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : visibleDocs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-foreground font-medium text-lg">
              {search ? "No documents match your search" : tab === "shared" ? "No shared documents" : "No documents yet"}
            </p>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              {search
                ? "Try a different search term or clear the search."
                : tab === "shared"
                ? "Documents shared with you will appear here."
                : "Create your first document to get started."}
            </p>
            {!search && tab !== "shared" && (
              <Button
                className="gap-2"
                onClick={() => createMutation.mutate()}
                disabled={!currentUser || createMutation.isPending}
              >
                <Plus className="w-4 h-4" /> Create your first document
              </Button>
            )}
            {search && (
              <Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                currentUser={currentUser}
                onOpen={(d) => navigate(`/editor/${d.id}`)}
                onRename={(d) => setRenameDoc(d)}
                onDelete={(d) => setDeleteDoc(d)}
              />
            ))}
          </div>
        )}
      </main>

      <RenameDialog
        open={!!renameDoc}
        onClose={() => setRenameDoc(null)}
        currentTitle={renameDoc?.title}
        onConfirm={(title) => renameMutation.mutate({ id: renameDoc.id, title })}
      />
      <DeleteConfirmDialog
        open={!!deleteDoc}
        onClose={() => setDeleteDoc(null)}
        docTitle={deleteDoc?.title}
        onConfirm={() => deleteMutation.mutate(deleteDoc.id)}
      />
    </div>
  );
}
