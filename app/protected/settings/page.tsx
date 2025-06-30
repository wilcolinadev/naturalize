import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { UserInfo } from "@/components/user-info";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import { Settings, User } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/protected" className="hover:text-foreground">
          {t('dashboard.title')}
        </Link>
        <span>/</span>
        <span className="text-foreground">Settings</span>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8" />
          <h1 className="font-bold text-3xl">User Settings</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Manage your account preferences and view your profile information
        </p>
      </div>

      {/* User Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h2 className="font-semibold text-xl">Profile Information</h2>
        </div>
        
        <UserInfo />
      </div>

      {/* Additional Settings Sections */}
      <div className="space-y-6">
        <h2 className="font-semibold text-xl">Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Language Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure your preferred language for the application
            </p>
            <p className="text-sm text-muted-foreground">
              Language settings are available in the top navigation
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Theme Preferences</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose between light and dark themes
            </p>
            <p className="text-sm text-muted-foreground">
              Theme toggle is available in the footer
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-6">
        <h2 className="font-semibold text-xl">Account</h2>
        
        <div className="p-6 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-semibold mb-2">Account Management</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Additional account management features coming soon
          </p>
        </div>
      </div>
    </div>
  );
} 