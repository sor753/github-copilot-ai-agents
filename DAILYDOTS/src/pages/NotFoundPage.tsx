import { Link } from 'react-router-dom';

import { AppLayout } from '../shared/components/app-layout';

const NotFoundPage = () => {
  return (
    <AppLayout title="ページが見つかりません" subtitle="URLをご確認ください。">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        ホームに戻る
      </Link>
    </AppLayout>
  );
};

export default NotFoundPage;
