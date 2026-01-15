import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
const LeadMagnetSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "¡Descarga en camino!",
      description: "Revisa tu bandeja de entrada para acceder a la guía."
    });
    setFormData({
      name: "",
      email: ""
    });
    setIsSubmitting(false);
  };
  return;
};
export default LeadMagnetSection;