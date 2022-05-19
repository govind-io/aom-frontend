import { Grid, Paper, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
export default function RoundtableCardSkeleton() {
  return (
    <Box
      style={{
        margin: "20px auto",
        maxWidth: "500px",
      }}
    >
      <Paper
        style={{
          width: "100%",
          padding: "10px 5px",
        }}
        elevation={5}
      >
        <Skeleton animation="wave" width={"100%"} height="100px" />
      </Paper>
    </Box>
  );
}
