import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="md:hidden p-4 border-b flex items-center bg-background/95 backdrop-blur">
                    <MobileSidebar />
                    <span className="font-bold ml-4">Tapryt</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
