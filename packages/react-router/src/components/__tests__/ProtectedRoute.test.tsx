/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {cleanup, render, screen, waitFor} from '@testing-library/react';
import {ReactElement} from 'react';
import {MemoryRouter, Route, Routes} from 'react-router';
import {Mock, afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import ProtectedRoute, {ProtectedRouteProps} from '../ProtectedRoute';

type SignInMock = Mock<(...args: unknown[]) => Promise<Record<string, string>>>;

/** The slice of the ThunderID context {@link ProtectedRoute} reads. */
interface ThunderIDState {
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: SignInMock;
  signInOptions?: Record<string, unknown>;
  signInUrl?: string;
  tokenRequest?: {params?: Record<string, unknown>};
}

interface Mocks {
  logger: {error: Mock<(message: string, ...args: unknown[]) => void>};
  navigate: Mock<(url: string) => void>;
  state: ThunderIDState;
}

const mocks: Mocks = vi.hoisted(() => ({}) as Mocks);

vi.mock('@thunderid/browser', () => ({
  createPackageComponentLogger: () => ({
    error: (message: string, ...args: unknown[]): void => mocks.logger.error(message, ...args),
  }),
}));

vi.mock('@thunderid/react', () => ({
  ThunderIDRuntimeError: class extends Error {
    public code: string;

    public details: unknown;

    public origin: string;

    public constructor(message: string, code: string, origin: string, details?: unknown) {
      super(message);
      this.code = code;
      this.origin = origin;
      this.details = details;
    }
  },
  navigate: (url: string): void => mocks.navigate(url),
  useThunderID: (): ThunderIDState => mocks.state,
}));

/**
 * Number of `signIn()` calls already recorded at the moment the loader rendered.
 *
 * The loader is part of the tree {@link ProtectedRoute} returns, so it renders in the same pass.
 * A non-zero value means `signIn()` ran during render rather than from an effect.
 */
let signInCallsAtLoaderRender: number | null = null;

function Loader({onRender}: {onRender: (signInCalls: number) => void}): ReactElement {
  onRender(mocks.state.signIn.mock.calls.length);

  return <div data-testid="loader" />;
}

function renderRoute(props: Partial<ProtectedRouteProps> = {}): {rerender: () => void} {
  const loader: ReactElement = (
    <Loader
      onRender={(signInCalls: number) => {
        signInCallsAtLoaderRender = signInCalls;
      }}
    />
  );

  // Built fresh per render: React bails out of re-rendering an identical element reference, which
  // would make every rerender() below a no-op.
  const buildTree = (): ReactElement => (
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute loader={loader} {...props}>
              <div data-testid="protected">secret</div>
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<div data-testid="signin-page" />} />
      </Routes>
    </MemoryRouter>
  );

  const result: {rerender: (ui: ReactElement) => void} = render(buildTree());

  return {rerender: () => result.rerender(buildTree())};
}

beforeEach(() => {
  signInCallsAtLoaderRender = null;
  mocks.logger = {error: vi.fn()};
  mocks.navigate = vi.fn();
  mocks.state = {
    isLoading: false,
    isSignedIn: false,
    signIn: vi.fn(() => Promise.resolve({sub: 'user-1'})),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ProtectedRoute authenticated states', () => {
  it('renders the loader while authentication status is being determined', () => {
    mocks.state.isLoading = true;

    renderRoute();

    expect(screen.getByTestId('loader')).toBeDefined();
    expect(mocks.state.signIn).not.toHaveBeenCalled();
  });

  it('renders the children when the user is signed in', () => {
    mocks.state.isSignedIn = true;

    renderRoute();

    expect(screen.getByTestId('protected')).toBeDefined();
    expect(mocks.state.signIn).not.toHaveBeenCalled();
  });

  it('never calls signIn while navigating between already-authenticated protected routes', () => {
    // Regression check: navigating to a new protected route mounts a fresh ProtectedRoute
    // instance (fresh refs). An already-signed-in user must never trigger sign-in, no matter how
    // many protected routes they move through.
    mocks.state.isSignedIn = true;

    renderRoute();

    expect(screen.getByTestId('protected')).toBeDefined();
    expect(mocks.state.signIn).not.toHaveBeenCalled();

    // Simulates leaving the route entirely and landing on a different protected route: the old
    // ProtectedRoute unmounts and a fresh instance (fresh refs) mounts in its place.
    cleanup();

    const {rerender} = renderRoute();

    expect(screen.getByTestId('protected')).toBeDefined();
    expect(mocks.state.signIn).not.toHaveBeenCalled();

    // A later re-render on that same route (e.g. an unrelated parent state change) must not
    // trigger sign-in either.
    rerender();

    expect(screen.getByTestId('protected')).toBeDefined();
    expect(mocks.state.signIn).not.toHaveBeenCalled();
  });
});

describe('ProtectedRoute unauthenticated states', () => {
  it('renders the fallback instead of initiating sign-in', () => {
    renderRoute({fallback: <div data-testid="fallback" />});

    expect(screen.getByTestId('fallback')).toBeDefined();
    expect(mocks.state.signIn).not.toHaveBeenCalled();
  });

  it('redirects when redirectTo is provided instead of initiating sign-in', async () => {
    renderRoute({redirectTo: '/signin'});

    await waitFor(() => expect(screen.getByTestId('signin-page')).toBeDefined());
    expect(mocks.state.signIn).not.toHaveBeenCalled();
  });

  it('navigates to signInUrl instead of initiating sign-in', async () => {
    mocks.state.signInUrl = 'https://localhost:8090/gate/signin';

    renderRoute();

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('https://localhost:8090/gate/signin'));
    expect(mocks.state.signIn).not.toHaveBeenCalled();
  });

  it('delegates to onSignIn instead of calling signIn directly', async () => {
    const onSignIn: Mock<() => void> = vi.fn();

    renderRoute({onSignIn, signInOptions: {prompt: 'login'}});

    await waitFor(() => expect(onSignIn).toHaveBeenCalledTimes(1));
    expect(onSignIn).toHaveBeenCalledWith(mocks.state.signIn, {prompt: 'login'});
    expect(mocks.state.signIn).not.toHaveBeenCalled();
  });

  it('reports a rejected custom onSignIn handler through the same error path as default sign-in', async () => {
    const onSignIn: Mock<() => Promise<void>> = vi.fn(() => Promise.reject(new Error('custom handler boom')));

    renderRoute({onSignIn});

    await waitFor(() => expect(mocks.logger.error).toHaveBeenCalledTimes(1));

    const [, reported] = mocks.logger.error.mock.calls[0] as [string, {code: string; details: unknown}];

    expect(reported.code).toBe('ProtectedRoute-SignInError-001');
    expect((reported.details as Error).message).toBe('custom handler boom');
  });
});

describe('ProtectedRoute default sign-in initiation', () => {
  it('renders the loader instead of throwing when no fallback or redirectTo is given', () => {
    // Regression: this state used to throw ProtectedRoute-Misconfiguration-001 unconditionally,
    // even though sign-in had just been initiated.
    expect(() => renderRoute()).not.toThrow();

    expect(screen.getByTestId('loader')).toBeDefined();
  });

  it('initiates sign-in from an effect, not during render', async () => {
    renderRoute();

    await waitFor(() => expect(mocks.state.signIn).toHaveBeenCalled());

    // The loader rendered in the same pass that would have issued a render-phase signIn().
    expect(signInCallsAtLoaderRender).toBe(0);
  });

  it('initiates sign-in only once across repeated re-renders', async () => {
    const {rerender} = renderRoute();

    await waitFor(() => expect(mocks.state.signIn).toHaveBeenCalled());

    rerender();
    rerender();
    rerender();

    await waitFor(() => expect(screen.getByTestId('loader')).toBeDefined());

    expect(mocks.state.signIn).toHaveBeenCalledTimes(1);
  });

  it('does not re-initiate sign-in while the pending sign-in toggles the loading state', async () => {
    mocks.state.signIn = vi.fn(
      () =>
        new Promise<Record<string, string>>(() => {
          // Never settles, mirroring a sign-in that ends in a full-page redirect.
        }),
    );

    const {rerender} = renderRoute();

    await waitFor(() => expect(mocks.state.signIn).toHaveBeenCalledTimes(1));

    // The in-flight signIn() flips the provider into loading and back out again before the browser
    // unloads for the redirect. The guard must survive that.
    mocks.state.isLoading = true;
    rerender();
    mocks.state.isLoading = false;
    rerender();

    await waitFor(() => expect(screen.getByTestId('loader')).toBeDefined());

    expect(mocks.state.signIn).toHaveBeenCalledTimes(1);
  });

  it('does not retry a failed sign-in on its own', async () => {
    mocks.state.signIn = vi.fn(() => Promise.reject(new Error('boom')));

    const {rerender} = renderRoute();

    await waitFor(() => expect(mocks.logger.error).toHaveBeenCalledTimes(1));

    // Toggling isLoading (as the provider does around every signIn() call) must not re-arm the
    // guard: the failed episode stays failed until it genuinely ends.
    mocks.state.isLoading = true;
    rerender();
    mocks.state.isLoading = false;
    rerender();

    expect(mocks.state.signIn).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('loader')).toBeDefined();
  });

  it('re-initiates sign-in once the failed episode ends and a new one begins', async () => {
    mocks.state.signIn = vi.fn(() => Promise.reject(new Error('boom')));

    const {rerender} = renderRoute();

    await waitFor(() => expect(mocks.state.signIn).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mocks.logger.error).toHaveBeenCalledTimes(1));

    // Episode ends (signed in) and a new one begins (signed out again).
    mocks.state.isSignedIn = true;
    rerender();
    mocks.state.isSignedIn = false;
    rerender();

    await waitFor(() => expect(mocks.state.signIn).toHaveBeenCalledTimes(2));
  });

  it('forwards signInOptions and tokenRequest params to signIn', async () => {
    mocks.state.signInOptions = {prompt: 'login'};
    mocks.state.tokenRequest = {params: {resource: 'https://api.example.com'}};

    renderRoute();

    await waitFor(() => expect(mocks.state.signIn).toHaveBeenCalled());

    expect(mocks.state.signIn).toHaveBeenCalledWith({prompt: 'login'}, undefined, undefined, undefined, {
      params: {resource: 'https://api.example.com'},
    });
  });

  it('reports a failed sign-in as a ThunderIDRuntimeError without rejecting', async () => {
    mocks.state.signIn = vi.fn(() => Promise.reject(new Error('boom')));

    renderRoute();

    await waitFor(() => expect(mocks.logger.error).toHaveBeenCalledTimes(1));

    const [, reported] = mocks.logger.error.mock.calls[0] as [string, {code: string; details: unknown; origin: string}];

    expect(reported.code).toBe('ProtectedRoute-SignInError-001');
    expect(reported.origin).toBe('react-router');
    expect((reported.details as Error).message).toBe('boom');

    // The failure is reported, not thrown, so the route keeps rendering.
    expect(screen.getByTestId('loader')).toBeDefined();
  });
});
