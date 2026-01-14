import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
const technologies = [{
  name: "GoHighLevel",
  abbr: "GHL"
}, {
  name: "N8N",
  abbr: "N8N"
}, {
  name: "Ubersuggest",
  abbr: "UB"
}, {
  name: "Hostinger",
  abbr: "HO"
}, {
  name: "Google Ads",
  abbr: "GA"
}];
const TechStackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px"
  });
  return;
};
export default TechStackSection;