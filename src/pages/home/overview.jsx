import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';

import Status, { StatusBadge } from 'components/shared/status';

import styles from './home.module.scss';

const cx = classNames.bind(styles);

const MAX_TOP_REPOS = 8;
const MAX_RUNNING_ROWS = 8;

export default function QueueOverview({ overview }) {
  const topReposAll = overview?.top_repos ?? [];
  const runningAll = overview?.running ?? [];
  const summary = overview?.summary ?? {};
  const topRepos = topReposAll.slice(0, MAX_TOP_REPOS);
  const running = runningAll.slice(0, MAX_RUNNING_ROWS);

  return (
    <section className={cx('overview')}>
      <h2 className={cx('section-title')}>Queue Overview</h2>

      <div className={cx('overview-cards')}>
        <OverviewCard label="Running Builds" value={summary.running_builds ?? 0} tone="running" />
        <OverviewCard label="Queued Builds" value={summary.queued_builds ?? 0} tone="queued" />
        <OverviewCard label="Repos Running" value={summary.repos_with_running ?? 0} tone="neutral" />
        <OverviewCard label="Repos Queued" value={summary.repos_with_queued ?? 0} tone="neutral" />
      </div>

      <div className={cx('overview-panels')}>
        <section className={cx('overview-panel', 'overview-panel-compact')}>
          <div className={cx('overview-panel-header')}>
            <h3>Top Repositories</h3>
            <span>
              {topReposAll.length}
              {' total'}
            </span>
          </div>
          {topRepos.length ? (
            <div className={cx('overview-table')}>
              <div className={cx('overview-row', 'overview-row-head')}>
                <span>Repository</span>
                <span>Running</span>
                <span>Queued</span>
                <span>Total</span>
              </div>
              {topRepos.map((repo) => (
                <div className={cx('overview-row')} key={repo.repo_id}>
                  <Link to={`/${repo.slug}`}>{repo.slug}</Link>
                  <span>{repo.running_builds}</span>
                  <span>{repo.queued_builds}</span>
                  <span>{repo.incomplete_builds}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No repositories are waiting on runners right now." />
          )}
        </section>

        <section className={cx('overview-panel', 'overview-panel-wide')}>
          <div className={cx('overview-panel-header')}>
            <h3>Running Builds</h3>
            <span>
              {runningAll.length}
              {' active stages'}
            </span>
          </div>
          {running.length ? (
            <div className={cx('overview-table')}>
              <div className={cx('overview-row', 'overview-row-head', 'overview-row-running')}>
                <span>Repository</span>
                <span>Build</span>
                <span>Stage</span>
                <span>Runner</span>
                <span>Started</span>
              </div>
              {running.map((item) => (
                <div className={cx('overview-row', 'overview-row-running')} key={item.stage_id}>
                  <Link to={`/${item.slug}`}>{item.slug}</Link>
                  <Link to={`/${item.slug}/${item.build_number}`} className={cx('overview-build-link')}>
                    <Status status={item.status} className={cx('overview-status-icon')} />
                    {'#'}
                    {item.build_number}
                  </Link>
                  <span className={cx('overview-stage')}>
                    <StatusBadge status={item.status} className={cx('overview-stage-badge')} />
                    <span className={cx('overview-stage-name')}>{item.stage_name}</span>
                  </span>
                  <span className={cx('overview-runner')} title={item.runner || 'n/a'}>{item.runner || 'n/a'}</span>
                  <span>{formatDistanceStrict(new Date(item.started * 1000), new Date(), { addSuffix: true })}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No stages are currently running." />
          )}
        </section>
      </div>
    </section>
  );
}

function OverviewCard({ label, value, tone }) {
  return (
    <div className={cx('overview-card', `overview-card-${tone}`)}>
      <span className={cx('overview-card-label')}>{label}</span>
      <strong className={cx('overview-card-value')}>{value}</strong>
    </div>
  );
}

function EmptyState({ message }) {
  return <div className={cx('overview-empty')}>{message}</div>;
}
