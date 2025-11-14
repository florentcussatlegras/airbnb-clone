"use server";

import { auth, ErrorCode } from "@/app/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

async function signInEmailAction(formData: FormData) {

    const email = String(formData.get("email") || "");
    if (!email) {
        return { error: "Please enter your email" };
    }

    const password = String(formData.get("password") || "");
    if (!password) {
        return { error: "Please enter your password" };
    }

    try {
        await auth.api.signInEmail({
            headers: await headers(),
            body: {
                email,
                password
            }
        });

        return { error: null }
    }catch (err) {
        console.log(err);
        if (err instanceof APIError) {
            const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

            switch(errCode) {
                case "EMAIL_NOT_VERIFIED":
                    redirect("/auth/verify?error=email_not_verified");
                default:
                    return { error: err.message }
            }
        }

        return { error: "Internal Server Error" };
    }

}

export default signInEmailAction;



// async function signUpAction(formState, formData) {

    // const result = SignUpFormSchema.safeParse(formData);

    
    // if(!result.success) {
    //     console.log(console.log(z.flattenError(result.error).fieldErrors));
    //     return { errors: z.flattenError(result.error).fieldErrors };
    // }

    // try {
    //   console.log("result data", result.data);
    // } catch (err) {
    //   if (err instanceof Error) {
    //     return {
    //       errors: {
    //         _form: [err.message],
    //       },
    //     };
    //   } else {
    //     return {
    //       errors: {
    //         _form: ["Something went wrong"],
    //       },
    //     };
    //   }
    // }

    // await signUp.email({
    //     email: formData.email,
    //     name: formData.name,
    //     password: formData.password
    // }, {
    //     onSuccess: () => {
    //         redirect("/dashboard");
    //     }
    // })