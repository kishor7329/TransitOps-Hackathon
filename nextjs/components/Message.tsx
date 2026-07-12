type MessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function Message({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-3`}
    >
      <div
        className={`max-w-[75%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        {content}
      </div>
    </div>
  );
}