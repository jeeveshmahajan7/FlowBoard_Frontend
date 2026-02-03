import { User } from "lucide-react";

const OwnersAvatarGroup = ({ owners = [] }) => {
  // If no owners exist, show default icon avatar
  if (!owners.length) {
    return (
      <div className="avatar placeholder">
        <div className="bg-base-200 w-8 rounded-full flex items-center justify-center">
          <User size={14} className="opacity-60" />
        </div>
      </div>
    );
  }

  // Fixed set of colors
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  // Function to get initials from owner name
  const getInitials = (name = "") => {
    const parts = name.trim().split(" "); // split by space (first + last name)

    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase() // First+Last initial
      : parts[0][0].toUpperCase(); // Only first initial
  };

  // Function to assign stable color based on first letter
  const getColorFromName = (name = "") => {
    const firstChar = name.trim()[0]?.toUpperCase(); // Example: "J"
    // Convert letter into number: A=0, B=1, C=2...
    const index = firstChar.charCodeAt(0) - 65;
    // Always return same color for same letter
    return colors[index % colors.length];
  };

  // Show max 3 owners
  const visibleOwners = owners.slice(0, 3);
  const extraCount = owners.length - 3;

  return (
    <div className="flex -space-x-2">
      {visibleOwners.map((owner) => {
        const color = getColorFromName(owner.name);

        return (
          <div key={owner._id} className="avatar">
            <div
              className={`w-8 rounded-full text-white text-xs font-semibold flex items-center justify-center ${color}`}
            >
              {getInitials(owner.name)}
            </div>
          </div>
        );
      })}

      {extraCount > 0 && (
        <div className="avatar placeholder">
          <div className="flex bg-base-100 w-8 rounded-full text-xs font-semibold items-center justify-center">
            +{extraCount}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersAvatarGroup;
