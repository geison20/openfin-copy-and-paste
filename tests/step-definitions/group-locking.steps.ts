import {
  AfterAll,
  BeforeAll,
  Given,
  Then,
  When,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { expect, Locator, Page } from "@playwright/test";
import {
  AppWorld,
  createWindowContext,
} from "../../testFixtures/createWindowContext";

type LockState = "checked" | "unchecked";

setDefaultTimeout(60_000);

let appWorld!: AppWorld;

BeforeAll(async () => {
  appWorld = await createWindowContext();
});

AfterAll(async () => {
  await appWorld.apiContext.dispose();
  await appWorld.context.close();
  await appWorld.browser.close();
});

function parseLockState(state: string): LockState {
  const normalized = state.trim().toLowerCase();

  if (normalized !== "checked" && normalized !== "unchecked") {
    throw new Error(
      `Unsupported lock switch state "${state}". Expected "checked" or "unchecked".`
    );
  }

  return normalized;
}

async function selectFirst(locator: Locator): Promise<Locator | null> {
  if ((await locator.count()) > 0) {
    return locator.first();
  }

  return null;
}

async function getLockSwitchLocator(page: Page): Promise<Locator> {
  const candidates: Array<() => Promise<Locator | null>> = [
    () => selectFirst(page.getByTestId("group-lock-switch")),
    () => selectFirst(page.locator("[data-test='group-lock-switch']")),
    () => selectFirst(page.getByRole("switch", { name: /lock/i })),
    () => selectFirst(page.getByRole("checkbox", { name: /lock/i })),
    () =>
      selectFirst(
        page.locator(
          "input[type='checkbox'][name*='lock' i], input[type='checkbox'][id*='lock' i]"
        )
      ),
  ];

  for (const candidate of candidates) {
    const locator = await candidate();
    if (locator) {
      return locator;
    }
  }

  throw new Error("Could not locate the group lock switch on the page.");
}

async function waitForLockSwitch(
  page: Page,
  timeout = 10_000
): Promise<Locator> {
  const deadline = Date.now() + timeout;
  let lastError: Error | undefined;

  while (Date.now() < deadline) {
    try {
      const locator = await getLockSwitchLocator(page);
      await locator.waitFor({
        state: "visible",
        timeout: Math.max(200, deadline - Date.now()),
      });
      return locator;
    } catch (error) {
      lastError = error as Error;
      await page.waitForTimeout(100);
    }
  }

  throw (
    lastError ??
    new Error("Lock switch did not become visible within the expected time.")
  );
}

async function readLockSwitchState(locator: Locator): Promise<LockState> {
  const ariaChecked = await locator.getAttribute("aria-checked");

  if (ariaChecked !== null) {
    return ariaChecked === "true" ? "checked" : "unchecked";
  }

  try {
    const isChecked = await locator.isChecked();
    return isChecked ? "checked" : "unchecked";
  } catch {
    const fallback = await locator.evaluate((element) => {
      const el = element as HTMLElement & {
        checked?: boolean;
        dataset?: DOMStringMap;
      };

      if (typeof (el as HTMLInputElement).checked === "boolean") {
        return (el as HTMLInputElement).checked;
      }

      if (el.dataset && typeof el.dataset.checked === "string") {
        return el.dataset.checked === "true";
      }

      return el.classList.contains("Mui-checked");
    });

    return fallback ? "checked" : "unchecked";
  }
}

async function assertLockSwitchState(
  locator: Locator,
  expected: LockState
): Promise<void> {
  const expectedAttr = expected === "checked" ? "true" : "false";
  const ariaChecked = await locator.getAttribute("aria-checked");

  if (ariaChecked !== null) {
    await expect(locator).toHaveAttribute("aria-checked", expectedAttr);
    return;
  }

  try {
    await expect(locator).toHaveJSProperty("checked", expected === "checked");
  } catch {
    const actual = await readLockSwitchState(locator);
    expect(actual).toBe(expected);
  }
}

async function ensureLockSwitchState(
  locator: Locator,
  desired: LockState
): Promise<void> {
  const current = await readLockSwitchState(locator);

  if (current !== desired) {
    await locator.click();
    await assertLockSwitchState(locator, desired);
  }
}

Given(
  "I am viewing the group details for group {string}",
  async (groupId: string) => {
    const { page, baseUrl } = appWorld;
    const url = new URL(`/groups/${groupId}`, baseUrl).toString();

    await page.goto(url);
    await page.waitForLoadState("networkidle");
  }
);

Then("I should see the group lock switch", async () => {
  const lockSwitch = await waitForLockSwitch(appWorld.page);

  await expect(lockSwitch).toBeVisible();
});

Given("the lock switch is {string}", async (state: string) => {
  const desiredState = parseLockState(state);
  const lockSwitch = await waitForLockSwitch(appWorld.page);

  await ensureLockSwitchState(lockSwitch, desiredState);
});

When("I set the lock switch to {string}", async (state: string) => {
  const desiredState = parseLockState(state);
  const lockSwitch = await waitForLockSwitch(appWorld.page);

  await ensureLockSwitchState(lockSwitch, desiredState);
});

Then("the lock switch should be {string}", async (state: string) => {
  const expectedState = parseLockState(state);
  const lockSwitch = await waitForLockSwitch(appWorld.page);

  await assertLockSwitchState(lockSwitch, expectedState);
});
