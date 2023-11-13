import React, { useState, useEffect } from "react";
import { Button, Checkbox, Select } from "antd";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { actions } from "../../models";
import cn from "../../utils/cn";
import { Form, actions as formActions, SelectField } from "../../utils/forms";
import { deleteConfirmation } from "../confirmation/component";
import "./style.less";

const { Option } = Select;
const { globalDelete } = actions;
const FORM_NAME = "groupAction";

const mapDispatchToProps = {
  globalDelete,
  formClear: formActions.formClear,
};

const GroupAction = ({
  connect,
  onAllCheckboxChange,
  dataSource,
  hideExtra,
  formClear,
  getList,
  onCancel,
  onClear,
  t,
}) => {
  const [action, setAction] = useState("");
  const sortDropdown = ["delete"];

  useEffect(() => {
    formClear(FORM_NAME);
  }, []);

  useEffect(() => {
    if (connect.length < 1 && action === "delete") {
      formClear(FORM_NAME);
      setAction("");
    }
  }, [connect, action]);

  const onDeleteOk = async () => {
    await globalDelete({ id: connect })();
    formClear(FORM_NAME);
    getList();
    onCancel?.();
    onClear?.();
  };

  const onDelete = () => {
    action === "delete" &&
      deleteConfirmation({
        onOk: onDeleteOk,
        title: t("deleteConfirm"),
        okText: t("yes"),
        okType: "danger",
        cancelText: t("no"),
      });
  };

  return (
    <Form name={FORM_NAME} className={cn()}>
      <SelectField
        className="select_placeholder"
        placeholder="Групповое действие"
        disabled={connect.length < 1}
        onChange={setAction}
        name="type"
        size="middle"
      >
        {sortDropdown.map((value) => (
          <Option
            value={value}
            key={value}
            onClick={hideExtra && value === "delete" ? onDelete : undefined}
          >
            {t(value)}
          </Option>
        ))}
      </SelectField>
      {!hideExtra && (
        <>
          <Button
            disabled={connect.length < 1 || action === ""}
            onClick={onDelete}
            type="primary"
            className={cn("add-button")}
          >
            {t("apply")}
          </Button>
          <Checkbox
            checked={connect.length === dataSource?.length}
            onChange={onAllCheckboxChange}
          >
            {t("forAll")}
          </Checkbox>
        </>
      )}
    </Form>
  );
};

export default connect(mapDispatchToProps)(
  translate("registry", { wait: true })(cn("group-action")(GroupAction))
);
