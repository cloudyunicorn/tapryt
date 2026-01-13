export function BackgroundGradient() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>
    );
}
