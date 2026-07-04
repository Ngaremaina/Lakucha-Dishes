import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input, { Label, FieldError } from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";
import { useToast } from "../../components/ui/Toast";
import { useCategories } from "../../hooks/useCategories";
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "../../hooks/useAdminCategories";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

const CategoryForm = ({ initialValues, onSubmit, onCancel, submitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: initialValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} error={!!errors.name} />
        <FieldError>{errors.name?.message}</FieldError>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>Save</Button>
      </div>
    </form>
  );
};

const AdminCategories = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const toast = useToast();

  const [modalState, setModalState] = useState(null); // null | { mode: 'create' } | { mode: 'edit', category }

  const closeModal = () => setModalState(null);

  const handleCreate = async (values) => {
    try {
      await createCategory.mutateAsync(values);
      toast({ title: "Category created" });
      closeModal();
    } catch (error) {
      toast({ title: "Failed to create category", description: error.response?.data?.message, variant: "error" });
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateCategory.mutateAsync({ id: modalState.category.id, category: values });
      toast({ title: "Category updated" });
      closeModal();
    } catch (error) {
      toast({ title: "Failed to update category", description: error.response?.data?.message, variant: "error" });
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await deleteCategory.mutateAsync(category.id);
      toast({ title: "Category deleted" });
    } catch (error) {
      toast({ title: "Failed to delete category", description: error.response?.data?.message, variant: "error" });
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalState({ mode: "create" })}>New category</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-border">
          {categories?.length ? (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-ink font-medium">{category.name}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setModalState({ mode: "edit", category })}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(category)}>Delete</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-6 text-ink-muted">No categories yet.</p>
          )}
        </Card>
      )}

      <Modal
        open={!!modalState}
        onOpenChange={(open) => !open && closeModal()}
        title={modalState?.mode === "edit" ? "Edit category" : "New category"}
      >
        {modalState && (
          <CategoryForm
            initialValues={modalState.mode === "edit" ? { name: modalState.category.name } : { name: "" }}
            onSubmit={modalState.mode === "edit" ? handleUpdate : handleCreate}
            onCancel={closeModal}
            submitting={createCategory.isPending || updateCategory.isPending}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminCategories;
