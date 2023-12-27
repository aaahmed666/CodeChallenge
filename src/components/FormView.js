import Select from "react-select";
import { useEffect, useState } from "react";
import { postData } from "../help/useFetch";
import { get_posts } from "../help/url_helper";

const FormView = ({ onSave, refillData, editData, sectorsArray }) => {
  const [formData, setFormData] = useState({
    name: editData ? editData.name : "",
    sectors: editData ? editData.sectors : [],
    agreeToTerms: editData ? editData.agreeToTerms : false,
  });

  const [errors, setErrors] = useState({
    name: "",
    sectors: "",
    agreeToTerms: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
      id: new Date().getTime(),
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      sectors: selectedOptions.map((option) => option.label),
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      sectors: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() ? "" : "Name is required",
      sectors: formData.sectors.length > 0 ? "" : "Sectors are required",
      agreeToTerms: formData.agreeToTerms ? "" : "Please agree to terms",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await postData(get_posts, formData);
      if (response) {
        onSave(formData);
        setFormData({
          name: "",
          sectors: [],
          agreeToTerms: false,
        });
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (refillData) {
      setFormData({
        name: refillData.name || "",
        sectors: refillData.sectors || [],
        agreeToTerms: refillData.agreeToTerms || false,
      });
    }
  }, [refillData]);

  return (
    <form onSubmit={handleSubmit}>
      <h4>
        Please enter your name and pick the Sectors you are currently involved
        in.
      </h4>
      <div className="form-group">
        <label htmlFor="name" className="label">
          Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          value={formData.name}
          className="form-control"
        />
        <div className="error-message">{errors.name}</div>
      </div>

      <div className="form-group">
        <label htmlFor="sectors" className="label">
          Sectors <span className="required">*</span>
        </label>
        <Select
          id="sectors"
          isMulti
          options={sectorsArray.map((option) => ({
            value: option.label,
            label: option.label,
          }))}
          value={sectorsArray.filter((option) =>
            formData.sectors.includes(option.label)
          )}
          onChange={handleMultiSelectChange}
        />
        <div className="error-message">{errors.sectors}</div>
      </div>
      <div className="form-group">
        <div className="from-group-check">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            onChange={handleChange}
            checked={formData.agreeToTerms}
          />
          <label htmlFor="agreeToTerms" className="agreelabel">
            Agree to terms <span className="required">*</span>
          </label>
        </div>
        <div className="error-message">{errors.agreeToTerms}</div>
      </div>

      <div className="form-actions">
        <button className="submit-button" type="submit">
          Save
        </button>
      </div>
    </form>
  );
};

export default FormView;
