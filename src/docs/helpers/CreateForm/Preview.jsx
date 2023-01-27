import Nullstack from "nullstack";

import { IconXCircle } from "nullstack-feather-icons";
import { object, string } from "yup";

import { Alert, Button, Input, Select, Textarea } from "~/components";
import { createForm } from "~/helpers";

const validationSchema = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  streetAddress: string().required("Street Address is required"),
  streetAddressComplement: string(),
  country: string().required("Country/Region is required"),
  state: string().required("State/Province is required"),
  city: string().required("City is required"),
  zip: string().required("Zip/Postal is required"),
  notes: string(),
});

class Preview extends Nullstack {
  form = {
    data: {},
    errors: {},
  };
  countries = [
    { value: "US", label: "United States" },
    { value: "AX", label: "Åland Islands" },
    { value: "AL", label: "Albania" },
  ];
  states = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
  ];

  hydrate() {
    this.form = createForm({ validationSchema });
  }

  async send() {
    await this.form.validate();

    if (this.form.isValid) {
      alert("Form is valid!");
    }
  }

  render() {
    return (
      <div class="preview max-w-lg mx-auto">
        <form onsubmit={this.send} class="grid gap-6">
          <div class="grid grid-cols-2 gap-x-4">
            <Input
              label="First Name"
              bind={this.form.data.firstName}
              error={this.form.errors.firstName}
            />
            <Input
              label="Last Name"
              bind={this.form.data.lastName}
              error={this.form.errors.lastName}
            />
          </div>
          <Input
            label="Street Address"
            bind={this.form.data.streetAddress}
            error={this.form.errors.streetAddress}
          />
          <Input
            label="Street Address Complement"
            bind={this.form.data.streetAddressComplement}
            error={this.form.errors.streetAddressComplement}
          />
          <div class="grid grid-cols-2 gap-x-4">
            <Select label="Country/Region" bind={this.form.data.country}>
              <option value="">Select a country</option>
              {this.countries.map((country) => (
                <option value={country.value}>{country.label}</option>
              ))}
            </Select>
            <Select label="State / Province" bind={this.form.data.state}>
              <option value="">Select a state</option>
              {this.states.map((state) => (
                <option value={state.value}>{state.label}</option>
              ))}
            </Select>
          </div>
          <div class="grid grid-cols-2 gap-x-4">
            <Input label="City" bind={this.form.data.city} error={this.form.errors.city} />
            <Input label="Zip/Postal" bind={this.form.data.zip} error={this.form.errors.zip} />
          </div>
          <Textarea label="Notes" error={this.form.errors.notes} />
          {Object.keys(this.form.errors).length > 0 && (
            <Alert color="danger" icon={IconXCircle}>
              <h4>Please, fill all the fields before submitting the form.</h4>
            </Alert>
          )}
          <div class="flex gap-3">
            <Button type="submit">Submit</Button>
            <Button color="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default Preview;
