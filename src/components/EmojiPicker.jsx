const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '✅', '👌', '🎉', '🚀', '💯', '😍'];
export default function EmojiPicker({ onSelectEmoji, onClose }) {
    return (
        <div className="absolute bottom-full mb-2 bg-white rounded-lg border border-slate-200 shadow-lg p-3 z-10">
            <div className="grid grid-cols-4 gap-2">
                {EMOJIS.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => onSelectEmoji(emoji)}
                        className="text-2xl hover:bg-slate-100 rounded-lg p-2 transition">
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}