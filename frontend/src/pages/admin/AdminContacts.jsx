import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { useToast } from "../../components/ui/Toast";
import { useContactMessages, useDeleteContactMessage } from "../../hooks/useAdminContacts";

const AdminContacts = () => {
  const { data: page, isLoading } = useContactMessages();
  const deleteMessage = useDeleteContactMessage();
  const toast = useToast();

  const handleDelete = async (message) => {
    if (!window.confirm(`Delete message from ${message.name}?`)) return;
    try {
      await deleteMessage.mutateAsync(message.id);
      toast({ title: "Message deleted" });
    } catch (error) {
      toast({ title: "Failed to delete message", description: error.response?.data?.message, variant: "error" });
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-border">
          {page?.content?.length ? (
            page.content.map((message) => (
              <div key={message.id} className="flex items-start justify-between px-4 py-3 gap-4">
                <div>
                  <p className="text-ink font-medium">{message.name} <span className="text-ink-muted font-normal">&lt;{message.email}&gt;</span></p>
                  <p className="text-sm text-ink mt-1">{message.message}</p>
                  <p className="text-xs text-ink-muted mt-1">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
                <Button variant="danger" onClick={() => handleDelete(message)}>Delete</Button>
              </div>
            ))
          ) : (
            <p className="px-4 py-6 text-ink-muted">No messages yet.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminContacts;
