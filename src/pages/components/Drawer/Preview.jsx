import Nullstack from "nullstack";

import { Button, Drawer } from "nullwind";

class Preview extends Nullstack {
  visible = false;

  render({ instances }) {
    return (
      <>
        <Button color="primary" onclick={() => instances.myDrawer.show()}>
          Open Drawer
        </Button>
        <Drawer key="myDrawer" class="mt-16">
          <div class="flex flex-col text-zinc-600 overflow-hidden max-h-full">
            <span class="text-lg font-semibold py-4">My Awesome Sidebar</span>
            <ul class="overflow-auto">
              {Array.from(Array(100).keys()).map((i) => (
                <li>Menu Item {i + 1}</li>
              ))}
            </ul>
          </div>
        </Drawer>
      </>
    );
  }
}

export default Preview;
