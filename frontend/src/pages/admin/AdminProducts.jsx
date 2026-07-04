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
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from "../../hooks/useAdminProducts";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.coerce.number().int().positive("Pick a category"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  quantity: z.coerce.number().int().min(0, "Quantity must be 0 or more"),
  image: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const ProductForm = ({ initialValues, categories, onSubmit, onCancel, submitting }) => {
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
      <div>
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          {...register("categoryId")}
          className="w-full rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-sm text-ink"
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <FieldError>{errors.categoryId?.message}</FieldError>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (Kshs.)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} error={!!errors.price} />
          <FieldError>{errors.price?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="quantity">Quantity in stock</Label>
          <Input id="quantity" type="number" {...register("quantity")} error={!!errors.quantity} />
          <FieldError>{errors.quantity?.message}</FieldError>
        </div>
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" {...register("image")} error={!!errors.image} />
        <FieldError>{errors.image?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="w-full rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-sm text-ink"
        />
        <FieldError>{errors.description?.message}</FieldError>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>Save</Button>
      </div>
    </form>
  );
};

const AdminProducts = () => {
  const { data: page, isLoading } = useProducts(0);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const toast = useToast();

  const [modalState, setModalState] = useState(null); // null | { mode: 'create' } | { mode: 'edit', product }

  const closeModal = () => setModalState(null);

  const handleCreate = async (values) => {
    try {
      await createProduct.mutateAsync(values);
      toast({ title: "Product created" });
      closeModal();
    } catch (error) {
      toast({ title: "Failed to create product", description: error.response?.data?.message, variant: "error" });
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateProduct.mutateAsync({ id: modalState.product.id, product: values });
      toast({ title: "Product updated" });
      closeModal();
    } catch (error) {
      toast({ title: "Failed to update product", description: error.response?.data?.message, variant: "error" });
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast({ title: "Product deleted" });
    } catch (error) {
      toast({ title: "Failed to delete product", description: error.response?.data?.message, variant: "error" });
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalState({ mode: "create" })}>New product</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-border">
          {page?.content?.length ? (
            page.content.map((product) => (
              <div key={product.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-ink font-medium">{product.name}</p>
                  <p className="text-sm text-ink-muted">
                    {product.categoryName ?? "Uncategorized"} · Kshs. {product.price} · {product.quantity} in stock
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setModalState({
                        mode: "edit",
                        product,
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(product)}>Delete</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-6 text-ink-muted">No products yet.</p>
          )}
        </Card>
      )}

      <Modal
        open={!!modalState}
        onOpenChange={(open) => !open && closeModal()}
        title={modalState?.mode === "edit" ? "Edit product" : "New product"}
      >
        {modalState && (
          <ProductForm
            categories={categories}
            initialValues={
              modalState.mode === "edit"
                ? {
                    name: modalState.product.name,
                    categoryId: modalState.product.categoryId ?? "",
                    price: modalState.product.price,
                    quantity: modalState.product.quantity,
                    image: modalState.product.image ?? "",
                    description: modalState.product.description ?? "",
                  }
                : { name: "", categoryId: "", price: 0, quantity: 0, image: "", description: "" }
            }
            onSubmit={modalState.mode === "edit" ? handleUpdate : handleCreate}
            onCancel={closeModal}
            submitting={createProduct.isPending || updateProduct.isPending}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminProducts;
