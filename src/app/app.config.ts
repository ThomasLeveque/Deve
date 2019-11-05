import CreateLinkPage from './pages/create-link.page';
import LoginPage from './pages/login.page';
import ForgotPasswordPage from './pages/forgot-password.page';
import SearchLinksPage from './pages/search-links.page';
import LinkListPage from './pages/link-list.page';
import LinkDetailPage from './pages/link-detail.page';

export interface IRoute {
  path: string;
  component: any;
}

export const routes: IRoute[] = [
  { path: 'create', component: CreateLinkPage },
  { path: 'login', component: LoginPage },
  { path: 'forgot', component: ForgotPasswordPage },
  { path: 'search', component: SearchLinksPage },
  { path: 'top', component: LinkListPage },
  { path: 'new', component: LinkListPage },
  { path: 'link/:linkId', component: LinkDetailPage }
];
