import * as React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { PipelineResourceTaskParam, PipelineTaskParam } from '../../../../utils/pipeline-augment';
import { ArrayParam, ParameterProps, SidebarInputWrapper, StringParam } from './temp-utils';

type TaskSidebarParamProps = {
  hasParamError?: boolean;
  resourceParam: PipelineResourceTaskParam;
  taskParam?: PipelineTaskParam;
  onChange: (newValue: string) => void;
};

const TaskSidebarParam: React.FC<TaskSidebarParamProps> = (props) => {
  const { hasParamError, onChange, resourceParam, taskParam } = props;
  const [dirty, setDirty] = React.useState(false);

  const currentValue = taskParam?.value;
  const emptyIsInvalid = !resourceParam.default;

  const isValid = !(dirty && hasParamError && emptyIsInvalid && currentValue != null);

  const paramRenderProps: ParameterProps = {
    currentValue,
    defaultValue: resourceParam.default,
    isValid,
    name: resourceParam.name,
    onChange,
    setDirty,
  };

  return (
    <FormGroup
      fieldId={resourceParam.name}
      label={resourceParam.name}
      helperText={resourceParam.type === 'string' ? resourceParam.description : null}
      helperTextInvalid="Required"
      isValid={isValid}
      isRequired={emptyIsInvalid}
    >
      {resourceParam.type === 'array' ? (
        <ArrayParam {...paramRenderProps} description={resourceParam.description} />
      ) : (
        <SidebarInputWrapper>
          <StringParam {...paramRenderProps} />
        </SidebarInputWrapper>
      )}
    </FormGroup>
  );
};

export default TaskSidebarParam;
