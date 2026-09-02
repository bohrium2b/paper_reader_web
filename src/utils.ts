import { PageProps } from './components/Page';

export function buildFilename(
  code: number,
  season: string,
  year: number,
  papertype: string,
  component: number,
  variant: number
): string {
  return `${code}_${season}${year.toString().padStart(2, '0')}_${papertype}_${component}${variant}.pdf`;
}

export function getLastVisitedPaper(): PageProps | null {
  const lastVisited = localStorage.getItem('lastVisitedPaper');
  if (lastVisited) {
    try {
      return JSON.parse(lastVisited) as PageProps;
    } catch {
      localStorage.removeItem('lastVisitedPaper');
      return null;
    }
  }
  return null;
}

export function saveLastVisitedPaper(paper: PageProps): void {
  try {
    localStorage.setItem('lastVisitedPaper', JSON.stringify(paper));
  } catch {
    // Storage full or unavailable — silently fail
  }
}
