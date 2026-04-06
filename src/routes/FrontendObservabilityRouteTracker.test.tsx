import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { useReactRouterPageViewsMock } = vi.hoisted(() => ({
  useReactRouterPageViewsMock: vi.fn()
}));

vi.mock("@mpa-forge/platform-frontend-observability/react-router", () => ({
  useReactRouterPageViews: useReactRouterPageViewsMock
}));

import { FrontendObservabilityRouteTracker } from "./FrontendObservabilityRouteTracker";

describe("FrontendObservabilityRouteTracker", () => {
  beforeEach(() => {
    useReactRouterPageViewsMock.mockReset();
  });

  it("delegates route tracking to the shared package helper", () => {
    render(<FrontendObservabilityRouteTracker />);

    expect(useReactRouterPageViewsMock).toHaveBeenCalledWith({
      getPageName: expect.any(Function)
    });

    const options = useReactRouterPageViewsMock.mock.calls[0]?.[0] as {
      getPageName: (location: { pathname: string }) => string;
    };

    expect(options.getPageName({ pathname: "/profile" })).toBe("/profile");
  });
});
