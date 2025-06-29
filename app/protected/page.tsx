import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { UserInfo } from "@/components/user-info";
import { InfoIcon } from "lucide-react";

export default async function ProtectedPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Note: UserInfo component will automatically handle user creation in Supabase
  // via the UserProvider in the layout

  return (
    <div className="flex-1 w-full flex flex-col gap-12 max-w-5xl mx-auto p-5">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Welcome to your citizenship practice dashboard!
        </div>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <h1 className="font-bold text-3xl mb-4">🇺🇸 Practice Dashboard</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Ready to continue your citizenship journey?
        </p>
      </div>

      {/* User Info Component - automatically creates user in Supabase if needed */}
      <UserInfo />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📚 Civics Test</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Practice the 100 civics questions for the naturalization test
          </p>
          <button className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm hover:bg-primary/90">
            Start Quiz
          </button>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">✍️ Reading Test</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Practice reading sentences about civics and history
          </p>
          <button className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm hover:bg-primary/90">
            Practice Reading
          </button>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📝 Writing Test</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Practice writing sentences about civics and history
          </p>
          <button className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm hover:bg-primary/90">
            Practice Writing
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">📊 Your Progress</h2>
        <div className="p-6 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            Progress tracking coming soon! Start practicing to see your improvement over time.
          </p>
        </div>
      </div>
    </div>
  );
}
