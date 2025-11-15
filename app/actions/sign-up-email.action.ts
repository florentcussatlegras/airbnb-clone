"use server";

import { auth, ErrorCode } from "@/app/lib/auth";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { APIError } from "better-auth/api";

// const SignUpFormSchema = z.object({
//     name: z.string().min(20),
//     email: z.string().email(),
//     password: z.string().min(16),
// });

async function signUpEmailAction(formData: any) {
  console.log(formData);
  // const getPasswordError = (value) => {
  //     if (value.length == 0) {
  //         return { error: "Please enter your password" };
  //     }
  //     // if (value.length < 4) {
  //     //     return { error: "Password must be 4 characters or more" };
  //     // }
  //     // if ((value.match(/[A-Z]/g) || []).length < 1) {
  //     //     return { error: "Password needs at least 1 uppercase letter" };
  //     // }
  //     // if ((value.match(/[^a-z]/gi) || []).length < 1) {
  //     //     return { error: "Password needs at least 1 symbol" };
  //     // }

  //     return null;
  // };

  // const getEmailError = (value) => {
  //     if (value.length == 0) {
  //         return { error: "Please enter your email" };
  //     }
  //     // if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) == true) {
  //     //     return { error: "Please enter a valid email adress" };
  //     // }
  // }

  // const firstname = String(formData.firstname);
  // if (!firstname) {
  //     return { error: "Veuillez saisir votre prénom" };
  // }

  const name = String(formData.get("name") || "");
  if (!name) {
    return { error: "Veuillez saisir votre nom" };
  }

  const email = String(formData.get("name") || "");
  if (!email) {
    return { error: "Veuillez saisir votre adresse email" };
  }
  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) == false) {
    return { error: "Veuillez saisir une adresse email valide" };
  }

  const password = String(formData.get("password") || "");
  if (!password) {
    return { error: "Please enter your password" };
  }
  if (password.length < 4) {
    return { error: "Password must be 4 characters or more" };
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    return { error: "Password needs at least 1 uppercase letter" };
  }
  if ((password.match(/[^a-z]/gi) || []).length < 1) {
    return { error: "Password needs at least 1 symbol" };
  }

  // const terms = Boolean(formData.get("terms"));
  // if (!terms) {
  //     return { error: "Veuillez accepter nos termes d'utilisation" };
  // }

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        case "USER_ALREADY_EXISTS":
          return { error: "Cet utilisateur existe déja" };
        default:
          return { error: err.message };
      }
    }

    return { error: "Internal Server Error" };
  }
}

export default signUpEmailAction;

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
