import { Box, Link, Typography } from '@mui/material';

// Pie discreto para las vistas principales
export function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid #eee', mt: 3, py: 2, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        © Domus {new Date().getFullYear()} · Proyecto de portfolio ·{' '}
        <Link href="https://github.com/claudiavas/domus" target="_blank" rel="noopener" underline="hover">
          GitHub
        </Link>
      </Typography>
    </Box>
  );
}
