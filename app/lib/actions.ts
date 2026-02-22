"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({ required_error: "Please select a customer." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    status: z.enum(["pending", "paid"], {
        invalid_type_error: "Please select an invoice status.",
    }),
    date: z.string(),
});

type FormSchema = z.infer<typeof FormSchema>;

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type ActionState = {
    message?: string | null;
    errors?: Partial<Record<keyof FormSchema, string[]>>;
};

export async function createInvoice(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const validated = CreateInvoice.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Invoice.",
        };
    }

    const { customerId, amount, status } = validated.data;

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0];

    try {
        await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to create invoice." };
    }

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse(
        Object.fromEntries(formData),
    );

    const amountInCents = amount * 100;

    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to update invoice." };
    }

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function deleteInvoice(
    id: string,
): Promise<void | { message: string }> {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath("/dashboard/invoices");
    } catch (error) {
        console.error(error);
        return { message: "Database Error: Failed to delete invoice." };
    }
}
