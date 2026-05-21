import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type PlaceholderChartPageProps = {
  title: string;
};

export function PlaceholderChartPage({ title }: PlaceholderChartPageProps) {
  return (
    <Box>
      <Typography variant="h1">{title}</Typography>
      <Paper variant="outlined" sx={{ mt: 3, p: 3 }}>
        <Typography color="text.secondary">
          과제 요구사항에 따라 라우팅만 연결한 placeholder 페이지입니다.
        </Typography>
      </Paper>
    </Box>
  );
}
