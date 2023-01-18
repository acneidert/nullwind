const Breadcrumb = ({ router }) => {
  const title = router.path.split("/")[1] || "Getting Started";

  return <p class="text-sm font-medium capitalize text-primary-500">{title}</p>;
};

export default Breadcrumb;
