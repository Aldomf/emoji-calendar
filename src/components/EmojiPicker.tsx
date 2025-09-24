import { EMOJIS } from "../consts/constants";

type Props = {
  selectedKey: string;
  setEmoji: (key: string, emoji: string) => void;
  clearEmoji: (key: string) => void;
  close: () => void;
};

export default function EmojiPicker({ selectedKey, setEmoji, clearEmoji, close }: Props) {
  return (
    <div className="picker">
      <div className="picker-title">Choose emoji for {selectedKey}</div>
      <div className="picker-row">
        {EMOJIS.map((e) => (
          <button key={e} className="emoji-btn" onClick={() => setEmoji(selectedKey, e)}>{e}</button>
        ))}
        <button className="clear-btn" onClick={() => clearEmoji(selectedKey)}>Clear</button>
        <button className="close-btn" onClick={close}>Cancel</button>
      </div>
    </div>
  );
}
