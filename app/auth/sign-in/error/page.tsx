
interface SignInErrorPageProps {
    searchParams: Promise<{ error: string }>
}

export default async function SignInErrorPage({ searchParams }: SignInErrorPageProps) {
  const sp = await searchParams;

  return (
    <div className="px-8 container mx-auto max-w-screen-lg space-y-8">
        <div className="space-y-8 w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold">Sign In Error</h1>
        </div>

        <p className="text-red-600">
            {sp.error === "account_not_linked"
            ?
            "This account is aready linked to another sign-in method"
            :
            "Oops! Something went wrong. Please try again."
            }
        </p>
    </div>
  );
}