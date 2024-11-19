import React from "react";
import { InputField } from "./InputField";
import { TimeSelect } from "./TimeSelect";
import { TermsCheckbox } from "./TermsCheckbox";

export const ContactSection = ({ formData, handleChange, setFormData }) => {
  return (
    <div className="w-full mt-6 space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InputField
          label="Prénom*"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Prénom"
          required
        />

        <InputField
          label="Nom*"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Nom"
          required
        />

        <InputField
          label="Email*"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <InputField
          label="Téléphone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Téléphone"
        />

        <InputField
          label="Rue/numéro"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Rue/Numéro"
        />

        <InputField
          label="Code postal"
          name="postalCode"
          type="number"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="Code postal"
        />

        <InputField
          label="Ville"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Ville"
        />

        <InputField
          label="Pays"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Pays"
        />

        <TimeSelect
          label="Check-in*"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1">
        <TermsCheckbox
          checked={formData.conditions}
          onChange={(e) =>
            setFormData((prevData) => ({
              ...prevData,
              conditions: e.target.checked,
            }))
          }
        />
      </div>
    </div>
  );
};
