function FormRow({ type, name, id, labelText, defaultValue }) {
  return (
    <div className="form-row">
      <label className="form-label" htmlFor={name}>
        {labelText || name}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className="form-input"
        defaultValue={defaultValue || ""}
        required
      />
    </div>
  );
}

export default FormRow;
