import Nullstack from "nullstack";

import { Button, Modal, MultiSelect } from "nullwind";

class Preview extends Nullstack {
  options = [
    { text: "arr Opt 1", value: 1, custom: "Custom 1" },
    { text: "arr Opt 2", value: 2, custom: "Custom 2" },
    { text: "arr Opt 3", value: 3, custom: "Custom 3" },
    { text: "arr Opt 4", value: 4, custom: "Custom 4" },
  ];
  visible = false;
  select1 = null;
  select2 = [];
  select3 = null;
  select4 = [];
  _customItem({ custom, text, value }) {
    return (
      <span class={value % 2 === 0 ? "bg-red-500" : "bg-cyan-500"}>
        {text} - {custom}
      </span>
    );
  }
  render() {
    return (
      <>
        <MultiSelect label="Options by Child" bind={this.select1}>
          <option value="1">Opt 1</option>
          <option value="2">Opt 2</option>
          <option value="3">Opt 3</option>
          <option value="4">Opt 4</option>
        </MultiSelect>
        {JSON.stringify(this.select1, null, 2)}
        <br />
        <MultiSelect label="Options by Param" options={this.options} bind={this.select2} />
        {JSON.stringify(this.select2, null, 2)}
        <br />
        <MultiSelect label="Options by Child + Param" options={this.options} bind={this.select3}>
          <option value="1">Opt 1</option>
          <option value="2">Opt 2</option>
          <option value="3">Opt 3</option>
          <option value="4">Opt 4</option>
        </MultiSelect>
        {JSON.stringify(this.select3, null, 2)}
        <br />
        <MultiSelect
          label="Options by Param with Template"
          options={this.options}
          template={this._customItem}
          bind={this.select4}
        />
        {JSON.stringify(this.select4, null, 2)}
        <br />
        <MultiSelect options={this.options} bind={this.select2} />
        {JSON.stringify(this.select2, null, 2)}
        <Button color="primary" onclick={() => (this.visible = true)}>
          Open modal
        </Button>
        <Modal visible={this.visible} onclose={() => (this.visible = false)}>
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <MultiSelect options={this.options} bind={this.select2} />
            {JSON.stringify(this.select2, null, 2)}
            <br />
            <MultiSelect
              label="Options by Param with Template"
              options={this.options}
              template={this._customItem}
              bind={this.select4}
            />
            {JSON.stringify(this.select4, null, 2)}
          </div>
          <footer class="bg-gray-50 px-4 py-3 flex justify-end sm:px-6 gap-2">
            <Button color="secondary" onclick={() => (this.visible = false)}>
              Close
            </Button>
            <Button color="primary" onclick={() => (this.visible = false)}>
              Save
            </Button>
          </footer>
        </Modal>
      </>
    );
  }
}

export default Preview;
