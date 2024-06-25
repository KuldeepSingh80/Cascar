function fillMissingIndicesWithInput(inputArray, filledArray, maximumrecord) {
  const recordsMap = new Map();

  // Populate a map with existing records from the inputArray using their indices as keys
  inputArray.forEach((item) => {
    if (
      item.index !== undefined &&
      item.index >= 1 &&
      item.index <= maximumrecord
    ) {
      recordsMap.set(item.index, item);
    }
  });
  function handlecolor(day) {
    switch (day) {
      // case "Saturday":
      //   originalItem.color = "#1C3C60";
      //   break;
      case "Monday":
        return "#56C72F";
      case "Tuesday":
        return "#3483DF";
      case "Wednesday":
        return "#FBBC5E";
      case "Thursday":
        return "#01CFC5";
      case "Friday":
        return "rgb(255, 100, 156)";
      case "Saturday":
        return "#1C3C60";
      case "Next Week":
        return "#8F2FAD";
      case "Overdue":
        return "#FF251E";
      default:
        return "#DDE5FD"; // Default color for unrecognized days
    }
  }
  // Replace the objects in the filledArray where matches are found in the inputArray
  const resultArray = filledArray.map((item) => {
    if (recordsMap.has(item.index)) {
      let originalItem = recordsMap.get(item.index);

      originalItem = Object.assign({}, originalItem, {
        color: "#DDE5FD", // Default color for unrecognized days
      });


      if (originalItem && originalItem.parking_session_id) {
        const worksSessions = originalItem?.works_sessions;
        const priorworksession = originalItem?.prior_work_session;
        if (priorworksession) {
          if (originalItem?.prior_work_session?.day_details?.is_overdue) {
            originalItem.color = handlecolor("Overdue");
          } else {
            originalItem.color = handlecolor(
              originalItem?.prior_work_session?.day_details?.day
            );
          }
        }

        Object.values(worksSessions)?.map((session) => {
          if (session.work.name === "Polishing") {
            if (session?.day_details?.is_overdue) {
              originalItem.Polishing = handlecolor("Overdue");
            } else {
              if (
                originalItem?.location_type.name === "Aisle" &&
                session?.day_details === null
              ) {
                originalItem.Polishing = "#50485A";
              } else {
                originalItem.Polishing = handlecolor(session?.day_details?.day);
              }
            }
          }
          if (session.work.name === "Washing") {
            if (session?.day_details?.is_overdue) {
              originalItem.Washing = handlecolor("Overdue");
            } else {
              originalItem.Washing = handlecolor(session?.day_details?.day);
              if (
                originalItem?.location_type.name === "Aisle" &&
                session?.day_details === null
              ) {
                originalItem.Washing = "#50485A";
              }
            }
          }
          if (session.work.name === "Repairing") {
            if (session?.day_details?.is_overdue) {
              originalItem.Repairing = handlecolor("Overdue");
            } else {
              originalItem.Repairing = handlecolor(session?.day_details?.day);
              if (
                originalItem?.location_type.name === "Aisle" &&
                session?.day_details === null
              ) {
                originalItem.Repairing = "#50485A";
              }
            }
          }
          if (session.work.name === "Pickup") {
            if (session?.day_details?.is_overdue) {
              originalItem.PickbyOwner = handlecolor("Overdue");
            } else {
              originalItem.PickbyOwner = handlecolor(session?.day_details?.day);
              if (
                originalItem?.location_type.name === "Aisle" &&
                session?.day_details === null
              ) {
                originalItem.PickbyOwner = "#50485A";
              }
            }
          }
        });
      }

      return originalItem;
    }
    return item;
  });

  return resultArray;
}

export const Ensure10Records = (inputArray, maximumrecord) => {

  const recordsMap = new Map();

  // Populate a map with existing records using their indices as keys
  inputArray.forEach((item) => {
    if (
      item.index !== undefined &&
      item.index >= 1 &&
      item.index <= maximumrecord
    ) {
      recordsMap.set(item.index, item);
    }
  });

  // Create a new array with 10 records, including any missing ones
  const filledArray = [];
  for (let i = 1; i <= maximumrecord; i++) {
    if (recordsMap.has(i)) {
      filledArray.push(recordsMap.get(i));
    } else {
      // Add a placeholder record for missing indices
      filledArray.push({
        index: i,
        placeholder: true,
      });
    }
  }
  const newData = fillMissingIndicesWithInput(
    inputArray,
    filledArray,
    maximumrecord
  );

  return newData;
  // Return the first 10 records from the resultArray
  //   return resultArray.slice(0, 10);
};
