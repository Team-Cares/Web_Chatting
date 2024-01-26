type ContextMenuProps = {
  contextMenu: {
    mouseX: number;
    mouseY: number;
    roomId: number;
  } | null;
  onClose: () => void;
  onLeaveRoom: (roomId: number) => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenu,
  onClose,
  onLeaveRoom,
}) => {
  if (!contextMenu) return null;

  const handleLeaveClick = () => {
    onLeaveRoom(contextMenu.roomId);
    onClose();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${contextMenu.mouseY}px`,
        left: `${contextMenu.mouseX}px`,
        zIndex: 1000,
      }}
      className="bg-white w-[180px] p-2"
    >
      <ul className="text-center">
        <li onClick={handleLeaveClick} className="hover:bg-gray-100">
          채팅방 나가기
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
