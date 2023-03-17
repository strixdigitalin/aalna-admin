import { Seek, CircularProgress } from "react-loading-indicators";

export const SeekLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "4vmin",
        marginBottom: "4vmin",
      }}
    >
      <Seek color={"#B71C1C"} size="small" text="" textColor="" />
    </div>
  );
};

export const CircularLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "4vmin",
        marginBottom: "4vmin",
      }}
    >
      <CircularProgress color={"#B71C1C"} size="small" text="" textColor="" />
    </div>
  );
};
