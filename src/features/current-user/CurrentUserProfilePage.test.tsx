import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const { authState, currentUserProfileState } = vi.hoisted(() => ({
  authState: {
    userDisplayName: null as string | null
  },
  currentUserProfileState: {
    status: "loading"
  } as Record<string, unknown>
}));

vi.mock("../../auth/FrontendAuthProvider", () => ({
  useFrontendAuth: () => authState
}));

vi.mock("../../api/currentUserProfile", () => ({
  useCurrentUserProfileData: () => currentUserProfileState
}));

import { CurrentUserProfilePage } from "./CurrentUserProfilePage";

describe("CurrentUserProfilePage", () => {
  beforeEach(() => {
    authState.userDisplayName = null;
    currentUserProfileState.status = "loading";
    delete currentUserProfileState.error;
    delete currentUserProfileState.profile;
  });

  it("renders an explicit loading state", () => {
    render(<CurrentUserProfilePage />);

    expect(
      screen.getByText("Loading current user profile...")
    ).toBeInTheDocument();
  });

  it("renders a classified configuration error state", () => {
    Object.assign(currentUserProfileState, {
      status: "error",
      error: {
        kind: "configuration",
        message: "Protected API configuration is incomplete."
      }
    });

    render(<CurrentUserProfilePage />);

    expect(
      screen.getByText("Protected API configuration error")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Protected API configuration is incomplete.")
    ).toBeInTheDocument();
  });

  it("renders a classified auth error state", () => {
    Object.assign(currentUserProfileState, {
      status: "error",
      error: {
        kind: "auth",
        message: "A Clerk session token is required."
      }
    });

    render(<CurrentUserProfilePage />);

    expect(screen.getByText("Protected API auth error")).toBeInTheDocument();
    expect(
      screen.getByText("A Clerk session token is required.")
    ).toBeInTheDocument();
  });

  it("renders a classified request error state", () => {
    Object.assign(currentUserProfileState, {
      status: "error",
      error: {
        kind: "request",
        message: "Permission denied."
      }
    });

    render(<CurrentUserProfilePage />);

    expect(screen.getByText("Protected API request error")).toBeInTheDocument();
    expect(screen.getByText("Permission denied.")).toBeInTheDocument();
  });

  it("renders the protected profile fields after the shared query flow succeeds", () => {
    authState.userDisplayName = "Casey Example";
    Object.assign(currentUserProfileState, {
      status: "success",
      profile: {
        userId: "user_123",
        email: "casey@example.com",
        displayName: "Casey Example",
        role: "user"
      }
    });

    render(<CurrentUserProfilePage />);

    expect(screen.getByText("Signed in as Casey Example.")).toBeInTheDocument();
    expect(screen.getByText("User ID: user_123")).toBeInTheDocument();
    expect(screen.getByText("Email: casey@example.com")).toBeInTheDocument();
    expect(screen.getByText("Display name: Casey Example")).toBeInTheDocument();
    expect(screen.getByText("Role: user")).toBeInTheDocument();
  });
});
