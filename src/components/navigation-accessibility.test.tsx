import { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AccessibleDialog } from "./AccessibleDialog";
import Header from "./Header";

vi.mock("@/contexts/BookingContext", () => ({ useBooking: () => ({ openBooking: vi.fn() }) }));
vi.mock("@/lib/blog", () => ({ publishedArticles: [] }));
afterEach(cleanup);

describe("accessible navigation", () => {
  it("exposes the services hub and five services, highlights the active route and returns focus on Escape", () => {
    render(<MemoryRouter initialEntries={["/servicios/seo"]}><Header /></MemoryRouter>);
    const nav = screen.getByRole("navigation", { name: "Navegación principal" });
    const trigger = within(nav).getByRole("button", { name: "Servicios" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    for (const name of ["Ver todos los servicios", "Diseño web", "Tiendas online", "SEO", "Publicidad digital", "Automatización con IA"]) {
      expect(within(nav).getByRole("link", { name: new RegExp(name) })).toBeInTheDocument();
    }
    expect(within(nav).getByRole("link", { name: /SEO/ })).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryByRole("link", { name: /WP Doctor|Web Express|Diagnóstico digital/ })).not.toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes mobile navigation on Escape and returns to its named trigger", () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    const trigger = screen.getByRole("button", { name: "Abrir navegación" });
    fireEvent.click(trigger);
    const nav = screen.getByRole("navigation", { name: "Navegación móvil" });
    fireEvent.keyDown(nav, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes the mobile services disclosure first and returns focus to Servicios", () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    const trigger = screen.getByRole("button", { name: "Abrir navegación" });
    fireEvent.click(trigger);
    const nav = screen.getByRole("navigation", { name: "Navegación móvil" });
    const services = within(nav).getByRole("button", { name: "Servicios" });
    fireEvent.click(services);
    const allServices = within(nav).getByRole("link", { name: "Ver todos los servicios" });
    expect(allServices).toHaveAttribute("href", "/servicios");
    fireEvent.keyDown(allServices, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(services).toHaveAttribute("aria-expanded", "false");
    expect(services).toHaveFocus();
  });
});

describe("controlled accessible dialog", () => {
  it("moves focus inside and returns it to the external trigger on close", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return <><button onClick={() => setOpen(true)}>Abrir prueba</button>
        <AccessibleDialog open={open} onClose={() => setOpen(false)} title="Prueba" description="Descripción">
          <button>Acción dentro</button>
        </AccessibleDialog></>;
    }
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Abrir prueba" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Prueba" });
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

