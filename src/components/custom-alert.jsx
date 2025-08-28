export default function CustomAlert({ message }) {
  return (
    <div className="text-red-500 border-2 border-red-300 rounded-lg p-2 bg-red-50 font-semibold">
      {message}
    </div>
  );
}
