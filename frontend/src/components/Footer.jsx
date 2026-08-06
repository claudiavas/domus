import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Unobtrusive footer for the main views
export function Footer() {
  const { t } = useTranslation('ui');
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', mt: 3, py: 2, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        © Domus {new Date().getFullYear()} · {t('footer')} ·{' '}
        <Link href="https://github.com/claudiavas/domus" target="_blank" rel="noopener" underline="hover">
          GitHub
        </Link>
      </Typography>
    </Box>
  );
}
