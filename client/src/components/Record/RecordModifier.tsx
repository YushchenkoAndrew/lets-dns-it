import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

import { ActionOptions, actionStore } from '../../redux/reducer/action.reducer';
import { useAppDispatch, useAppSelector } from '../../redux/storage';
import { ObjectLiteral } from '../../types';
import DropdownButton from '../DropdownButton';

export interface RecordModifierProps {
  onSubmit: (prop: ActionOptions, res: ObjectLiteral) => void;
  onDelete: (prop: ActionOptions) => void;
}

export default function RecordModifier(props: RecordModifierProps) {
  const popupRef = useRef(null);

  const { options, data } = useAppSelector((state) => state.action);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = (event: MouseEvent) =>
      popupRef.current && !popupRef.current.contains(event.target)
        ? dispatch(actionStore.actions.unfocus())
        : undefined;

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popupRef]);

  return data ? (
    <div>
      <div
        ref={popupRef}
        className="fixed top-1/2 left-1/2 w-full max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-full -translate-y-1/2 -translate-x-1/2 z-50 p-4 overflow-x-hidden overflow-y-auto"
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl ml-1 font-semibold text-gray-900 dark:text-white">
              Record Modifier
            </h3>
            <FontAwesomeIcon
              icon="xmark"
              className="w-5 h-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => dispatch(actionStore.actions.unfocus())}
            />
          </div>

          <form
            className="flex flex-col p-6"
            onSubmit={(event) => {
              event?.preventDefault();
              if (!event.currentTarget.checkValidity()) {
                event.stopPropagation();
                return;
              }

              props.onSubmit(options, { ...data });
              dispatch(actionStore.actions.unfocus());
            }}
          >
            <div className="py-3 flex items-center justify-between">
              <DropdownButton
                actions={{
                  favorite: {
                    name: (
                      <>
                        <FontAwesomeIcon icon="star" className="mr-2" />
                        {options.isFavorite
                          ? 'Unset from favorite'
                          : 'Set as favorite'}
                      </>
                    ),
                    hidden: options.isFavorite === undefined,
                    onClick: () =>
                      dispatch(actionStore.actions.toggleFavorite()),
                  },
                  delete: {
                    name: (
                      <>
                        <FontAwesomeIcon icon="trash" className="mr-2" />
                        Delete record
                      </>
                    ),
                    hidden: options.id === undefined,
                    onClick: () => (
                      props.onDelete(options),
                      dispatch(actionStore.actions.unfocus())
                    ),
                  },
                }}
              />

              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>

            <table className="record-modifier border-b-2 border-collapse table-auto">
              <thead className="dark:border-b-4">
                <tr>
                  {Object.keys(data).map((name, index) => (
                    <th
                      key={`modifier_thead_${index}`}
                      className="font-semibold text-gray-900 dark:text-gray-100 px-4 py-2 text-left"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-900 dark:text-gray-100 ">
                  {Object.entries(data).map(([name, value], index) => (
                    <td
                      key={`modifier_tbody_td_${index}`}
                      className="p-4 decoration-2"
                    >
                      <input
                        name={name}
                        value={value}
                        required={options.required?.includes(name)}
                        className="pt-1 pb-1 px-3 w-full border-b-2 focus:border-b-4 last:border-r-0 dark:bg-gray-800 dark:focus:bg-gray-700 focus:outline-none"
                        placeholder="Insert value"
                        onChange={(event) =>
                          dispatch(
                            actionStore.actions.onUpdate({
                              name,
                              value: event.target.value,
                            }),
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
      <div className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
    </div>
  ) : (
    <></>
  );
}