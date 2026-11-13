import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { sendEmailSubmission } from "@/lib/emailSubmission";

vi.mock("@/lib/emailSubmission", () => ({ sendEmailSubmission: vi.fn() }));
const send = vi.mocked(sendEmailSubmission);
const gtag = vi.fn();

beforeEach(() => { vi.clearAllMocks(); vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} }); Object.assign(window, { gtag }); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const showForm = () => render(<MemoryRouter><ContactForm /></MemoryRouter>);
const fillForm = () => {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText("WhatsApp con indicativo de país"), { target: { value: "+57 300 123 4567" } });
  fireEvent.click(screen.getByRole("checkbox"));
};

describe("contact conversion boundaries", () => {
  it("reports a WhatsApp click without declaring a captured lead", () => {
    render(<MemoryRouter><WhatsAppButton /></MemoryRouter>);
    fireEvent.click(screen.getByRole("link", { name: "Contactar por WhatsApp" }));
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_clicked", { trigger: "button" });
    expect(gtag.mock.calls.some(call => call[1] === "lead_captured")).toBe(false);
  });

  it("focuses the first invalid field and does not submit missing consent", () => {
    showForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud de contacto" }));
    expect(screen.getByLabelText("Nombre")).toHaveFocus();
    expect(screen.getByLabelText("Nombre")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Revisa los campos");
    expect(send).not.toHaveBeenCalled();
  });

  it("retains answers after failure and confirms a lead only after a successful retry", async () => {
    send.mockRejectedValueOnce(new Error("No pudimos confirmar el envío.")).mockResolvedValueOnce({ success: true } as never);
    showForm(); fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud de contacto" }));
    await screen.findByText("No pudimos confirmar el envío.");
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana");
    expect(gtag.mock.calls.some(call => call[1] === "lead_captured")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud de contacto" }));
    await screen.findByText("Solicitud recibida");
    await waitFor(() => expect(gtag).toHaveBeenCalledWith("event", "lead_captured", { source: "form" }));
    const requestIds = send.mock.calls.map(([payload]) => typeof payload === "object" && payload !== null && "requestId" in payload ? payload.requestId : undefined);
    expect(requestIds[0]).toEqual(expect.any(String));
    expect(requestIds[0]).toBe(requestIds[1]);
  });
});
