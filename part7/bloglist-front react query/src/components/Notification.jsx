const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      data-testid="notification"
      className={type === "success" ? "success" : "error"}
    >
      {message}
    </div>
  );
};

export default Notification;
